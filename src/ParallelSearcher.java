//

import net.semanticmetadata.lire.aggregators.AbstractAggregator;
import net.semanticmetadata.lire.aggregators.BOVW;
import net.semanticmetadata.lire.builders.*;
import net.semanticmetadata.lire.classifiers.Cluster;
import net.semanticmetadata.lire.classifiers.KMeans;
import net.semanticmetadata.lire.classifiers.ParallelKMeans;
import net.semanticmetadata.lire.imageanalysis.features.Extractor;
import net.semanticmetadata.lire.imageanalysis.features.GlobalFeature;
import net.semanticmetadata.lire.imageanalysis.features.LocalFeature;
import net.semanticmetadata.lire.imageanalysis.features.LocalFeatureExtractor;
import net.semanticmetadata.lire.imageanalysis.features.global.CEDD;
import net.semanticmetadata.lire.imageanalysis.features.global.FCTH;
import net.semanticmetadata.lire.imageanalysis.features.global.JCD;
import net.semanticmetadata.lire.imageanalysis.features.local.simple.SimpleExtractor;
import net.semanticmetadata.lire.utils.FileUtils;
import net.semanticmetadata.lire.utils.ImageUtils;
import net.semanticmetadata.lire.utils.LuceneUtils;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.index.IndexWriter;

import net.semanticmetadata.lire.indexers.parallel.ParallelIndexer;
import net.semanticmetadata.lire.imageanalysis.features.global.*;
import net.semanticmetadata.lire.imageanalysis.features.global.joint.JointHistogram;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.logging.Logger;

import org.apache.lucene.index.IndexReader;

import net.semanticmetadata.lire.imageanalysis.features.LocalFeature;

import java.util.List;

import net.semanticmetadata.lire.searchers.ImageSearchHits;
import net.semanticmetadata.lire.searchers.ImageSearcher;
import net.semanticmetadata.lire.searchers.GenericFastImageSearcher;
import net.semanticmetadata.lire.filters.RerankFilter;

import com.google.gson.Gson;

public class ParallelSearcher implements Runnable {
    private IndexReader indexReader = null;
    private boolean searchingFinished = false;

    private int overallCount = -1;

    private int queueCapacity = 200;
    private LinkedBlockingQueue<WorkItem> queue = new LinkedBlockingQueue<>(queueCapacity);

    private int numOfThreads = 32;

    private List<Integer> allImageIds = null;
    private ArrayList<Hashtable<String, String>> rawIndex = null;

    public ParallelSearcher(IndexReader inIndexReader) {
      this.indexReader = inIndexReader;

      this.allImageIds = new ArrayList<Integer>();

      this.rawIndex = new ArrayList<Hashtable<String, String>>();

      try {
        for (int i = 0; i < this.indexReader.numDocs(); i++) {
          String docFile = this.indexReader.document(i).getValues(DocumentBuilder.FIELD_NAME_IDENTIFIER)[0];
          Hashtable<String, String> docu = new Hashtable<String, String>();
          docu.put("id", String.format("%d", i));
          docu.put("filename", docFile);
          rawIndex.add(docu);
          allImageIds.add(i);
        }
      } catch (IOException e) {
        System.out.println("wtf");
        System.exit(1);
      }
    }

    public ArrayList getRawIndex() {
      return this.rawIndex;
    }

    public void run() {

      search();

      searchingFinished = true;
    }

    class Producer implements Runnable {
      private List<Integer> localList;

      public Producer(List<Integer> inLocalList) {
          this.localList = inLocalList;
          overallCount = 0;
          queue.clear();
      }

      public void run() {
        Integer next;
        for (Integer path : localList) {
          next = path;
          try {
            queue.put(new WorkItem(next));
          } catch (InterruptedException e) {
            e.printStackTrace();
          }
        }

        Integer path = null;
        for (int i = 0; i < numOfThreads * 3; i++) {
          try {
            queue.put(new WorkItem(path));
          } catch (InterruptedException e) {
            e.printStackTrace();
          }
        }
      }
    }

    class WorkItem {
      private Integer fileNameId;

      public WorkItem(Integer pathId) {
          this.fileNameId = pathId;
      }

      public Integer getFileNameId() {
          return fileNameId;
      }
    }

    class Consumer implements Runnable {
        private IndexReader indexReader;
        private boolean locallyEnded;

        public Consumer(IndexReader inIndexReader) {
          this.indexReader = inIndexReader;
          this.locallyEnded = false;
        }

        public void run() {
            Gson gson = new Gson();

            WorkItem tmp = null;
            while (!locallyEnded) {
                try {
                    if (queue.peek()==null) {
                        Thread.sleep((long) ((Math.random()/2+0.5) * 10000)); // sleep for a second if queue is empty.
                    }
                    tmp = queue.take();
                    if (tmp.getFileNameId() == null) locallyEnded = true;
                    else overallCount++;
                    if (!locallyEnded) {
                      // search
                      Document document = this.indexReader.document(tmp.getFileNameId());

                      ImageSearcher searcher = new GenericFastImageSearcher(32, AutoColorCorrelogram.class, true, this.indexReader);
                      ImageSearchHits hits = searcher.search(document, this.indexReader);

                      // rerank
                      System.out.println("---< filtering >-------------------------");
                      RerankFilter filter = new RerankFilter(ColorLayout.class, DocumentBuilder.FIELD_NAME_COLORLAYOUT);
                      hits = filter.filter(hits, this.indexReader, document);

                         Writer writer = new BufferedWriter(
                                           new OutputStreamWriter(
																		         new FileOutputStream(
                                               String.format("build/%d.json", tmp.getFileNameId())
                                             )
                                           )
                                         );

												 writer.write(gson.toJson(hits));
                         writer.close();
									 }
                } catch (InterruptedException e) {
                } catch (Exception e) {
                }
            }
        }
    }

    public boolean search() {

      try {
        Thread p, c, m;
        p = new Thread(new Producer(this.allImageIds), "Producer");
        p.start();
        LinkedList<Thread> threads = new LinkedList<Thread>();
        for (int i = 0; i < numOfThreads; i++) {
          c = new Thread(new Consumer(this.indexReader), String.format("Consumer-%02d", i + 1));
          c.start();
          threads.add(c);
        }

        for (Thread thread : threads) {
            thread.join();
        }
      } catch (InterruptedException e) {
          e.printStackTrace();
      }

        return true;
    }

    public boolean hasEnded() {
        return searchingFinished;
    }
}
