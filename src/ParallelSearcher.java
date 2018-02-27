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

//import net.semanticmetadata.lire.imageanalysis.features.global.ACCID;

public class ParallelSearcher implements Runnable {
    private IndexReader indexReader = null;
    private boolean searchingFinished = false;

    private int overallCount = -1, numImages = -1; //, numSample = -1
    // Note that you can edit the queue size here. 100 is a good value, but I'd raise it to 200.
    private int queueCapacity = 200;
    private LinkedBlockingQueue<WorkItem> queue = new LinkedBlockingQueue<>(queueCapacity);

/*
    private boolean useDocValues = false;
    private Logger log = Logger.getLogger(this.getClass().getName());
    private ProgressMonitor pm = null;
    private DecimalFormat df = (DecimalFormat) NumberFormat.getNumberInstance();
    private int numOfThreads = DocumentBuilder.NUM_OF_THREADS;
    private int monitoringInterval = 30; // all xx seconds a status message will be displayed
    private boolean overWrite = true;   //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    private boolean useParallelClustering = true;
    private boolean lockLists = false;
    private boolean sampling = false;
    private boolean appending = false;
    private boolean globalHashing = false;
    private GlobalDocumentBuilder.HashingMode globalHashingMode = GlobalDocumentBuilder.HashingMode.BitSampling;

    private IndexWriter writer;
    private String imageDirectory, indexPath;
    private File imageList = null;
    private List<String> allImages, sampleImages;

    private int numOfDocsForCodebooks = 300;
    private int[] numOfClusters = new int[]{512};
    private TreeSet<Integer> numOfClustersSet = new TreeSet<Integer>();

    private HashSet<ExtractorItem> GlobalExtractors = new HashSet<ExtractorItem>(10); // default size (16)
    private HashMap<ExtractorItem, LinkedList<Cluster[]>> LocalExtractorsAndCodebooks = new HashMap<ExtractorItem, LinkedList<Cluster[]>>(10); // default size (16)
    private HashMap<ExtractorItem, LinkedList<Cluster[]>> SimpleExtractorsAndCodebooks = new HashMap<ExtractorItem, LinkedList<Cluster[]>>(10); // default size (16)

    private Class<? extends DocumentBuilder> customDocumentBuilder = null;
    private boolean customDocBuilderFlag = false;

    private ConcurrentHashMap<String, List<? extends LocalFeature>> conSampleMap;

    private Class<? extends AbstractAggregator> aggregator = BOVW.class;

    private HashMap<String, Document> allDocuments;

    private ImagePreprocessor imagePreprocessor;
*/

    private List<Integer> allImageIds = null;
    private ArrayList<Hashtable<String, String>> rawIndex = null;

    public ParallelSearcher(IndexReader inIndexReader) {
      this.indexReader = inIndexReader;
    }

    public void run() {
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
        /*
            File next;
            for (String path : localList) {
                next = new File(path);
                try {
                    int fileSize = (int) next.length();
                    byte[] buffer = new byte[fileSize];
                    FileInputStream fis = new FileInputStream(next);
                    FileChannel channel = fis.getChannel();
                    MappedByteBuffer map = channel.map(FileChannel.MapMode.READ_ONLY, 0, fileSize);
                    map.load();
                    map.get(buffer);
                    queue.put(new WorkItem(path, buffer));
                    channel.close();
                    fis.close();
                } catch (Exception e) {
                    System.err.println("Could not open " + path + ". " + e.getMessage());
                }
            }
            String path = null;
            byte[] buffer = null;
            for (int i = 0; i < numOfThreads * 3; i++) {
                try {
                    queue.put(new WorkItem(path, buffer));
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
    */
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
    /*
        private LocalDocumentBuilder localDocumentBuilder;
        private SimpleDocumentBuilder simpleDocumentBuilder;
        private GlobalDocumentBuilder globalDocumentBuilder;
        private DocumentBuilder localCustomDocumentBuilder;
        */
        private IndexReader indexReader;
        private boolean locallyEnded;

        public Consumer(IndexReader inIndexReader) {
          this.indexReader = inIndexReader;

        /*
            this.localDocumentBuilder = new LocalDocumentBuilder(aggregator);
            this.simpleDocumentBuilder = new SimpleDocumentBuilder(aggregator);
            this.globalDocumentBuilder = new GlobalDocumentBuilder(globalHashing, globalHashingMode, useDocValues);

            for (Map.Entry<ExtractorItem, LinkedList<Cluster[]>> listEntry : LocalExtractorsAndCodebooks.entrySet()) {
                this.localDocumentBuilder.addExtractor(listEntry.getKey().clone(), listEntry.getValue());
            }
            for (Map.Entry<ExtractorItem, LinkedList<Cluster[]>> listEntry : SimpleExtractorsAndCodebooks.entrySet()) {
                this.simpleDocumentBuilder.addExtractor(listEntry.getKey().clone(), listEntry.getValue());
            }
            for (ExtractorItem globalExtractor : GlobalExtractors) {
                this.globalDocumentBuilder.addExtractor(globalExtractor.clone());
            }

            try {
                if (customDocumentBuilder != null) {
                    this.localCustomDocumentBuilder = customDocumentBuilder.newInstance();
                } else this.localCustomDocumentBuilder = new GlobalDocumentBuilder(false);
            } catch (InstantiationException | IllegalAccessException e) {
                e.printStackTrace();
            }

            this.locallyEnded = false;
        */
        }

        public void run() {
/*
            WorkItem tmp = null;
            Document doc;
            Field[] fields;
            BufferedImage image;
            while (!locallyEnded) {
                try {
                    if (queue.peek()==null) {
//                        while (queue.remainingCapacity() > 2*queueCapacity/3) Thread.sleep(1000);
                        Thread.sleep((long) ((Math.random()/2+0.5) * 10000)); // sleep for a second if queue is empty.
                    }
                    tmp = queue.take();
                    if (tmp.getFileName() == null) locallyEnded = true;
                    else overallCount++;
                    if (!locallyEnded) {    //&& tmp != null
                        image = ImageIO.read(new ByteArrayInputStream(tmp.getBuffer()));
//                        image = ImageUtils.createWorkingCopy(ImageIO.read(new ByteArrayInputStream(tmp.getBuffer())));
                        if(imagePreprocessor != null){
                            image = imagePreprocessor.process(image);
                        }
                        doc = localCustomDocumentBuilder.createDocument(image, tmp.getFileName());
                        fields = globalDocumentBuilder.createDescriptorFields(image);
                        for (Field field : fields) {
                            doc.add(field);
                        }
                        fields = localDocumentBuilder.createDescriptorFields(image);
                        for (Field field : fields) {
                            doc.add(field);
                        }
                        fields = simpleDocumentBuilder.createDescriptorFields(image);
                        for (Field field : fields) {
                            doc.add(field);
                        }
                        writer.addDocument(doc);
                    }
                } catch (InterruptedException | IOException e) {
                    log.severe(e.getMessage() + ": " + tmp!=null?tmp.getFileName():"");
                } catch (Exception e) {
                    log.severe(e.getMessage() + ": " + tmp!=null?tmp.getFileName():"");
                }
            }
*/
        }

    }

    public boolean search() {
      int numOfThreads = 1;

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

        // search
        //Document document = reader.document(i);
        //ImageSearcher searcher = new GenericFastImageSearcher(32, AutoColorCorrelogram.class, true, reader);
        //ImageSearchHits hits = searcher.search(document, reader);

        // rerank
        //System.out.println("---< filtering >-------------------------");
        //RerankFilter filter = new RerankFilter(ColorLayout.class, DocumentBuilder.FIELD_NAME_COLORLAYOUT);
        //hits = filter.filter(hits, reader, document);

        //// output
        ////FileUtils.saveImageResultsToHtml(String.format("%04d-filtertest", i), hits, document.getValues(DocumentBuilder.FIELD_NAME_IDENTIFIER)[0], reader);

        ////System.out.println(gson.toJson(hits));
        return true;
    }

    public boolean hasEnded() {
        return searchingFinished;
    }
}
