//

import net.semanticmetadata.lire.builders.*;
import net.semanticmetadata.lire.imageanalysis.features.global.*;
import net.semanticmetadata.lire.searchers.ImageSearchHits;
import net.semanticmetadata.lire.searchers.ImageSearcher;
import net.semanticmetadata.lire.searchers.GenericFastImageSearcher;
import net.semanticmetadata.lire.filters.RerankFilter;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.*;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.List;

import org.apache.lucene.document.Document;
import org.apache.lucene.index.IndexReader;

import com.google.gson.Gson;

class ParallelSearcher implements Runnable {
    private final IndexReader indexReader;
    private boolean searchingFinished;

    private int overallCount = - 1;

    private final int queueCapacity = 1024;
    private final LinkedBlockingQueue<ParallelSearcher.WorkItem> queue = new LinkedBlockingQueue<> (queueCapacity);

    private int numOfThreads = -1;

    private final List<Integer> allImageIds;
    private final ArrayList<Hashtable<String, String>> rawIndex;

    public ParallelSearcher (int numOfThreads, IndexReader inIndexReader) {
        this.numOfThreads = numOfThreads;
        indexReader = inIndexReader;

        allImageIds = new ArrayList<> ();

        rawIndex = new ArrayList<> ();

        try {
            for (int i = 0; i < indexReader.numDocs (); i++) {
                String docFile = indexReader.document (i).getValues (DocumentBuilder.FIELD_NAME_IDENTIFIER)[0];
                Hashtable<String, String> docu = new Hashtable<> ();
                docu.put ("id", String.format ("%d", i));
                docu.put ("filename", docFile);


                rawIndex.add (docu);
                allImageIds.add (i);
            }
        } catch (IOException e) {
            System.out.println ("wtf");
            System.out.println (e);
            System.exit (1);
        }
    }

    ArrayList getRawIndex () {
//        Stream<Hashtable<String, String>> remappedStream = null;
//
//        remappedStream = this.rawIndex.stream ();
//
//        remappedStream.map (s -> {
//            s.put ("fart", "bip");
//            return s;
//        });

        return rawIndex;
    }

    @Override
    public void run () {
        search ();
        searchingFinished = true;
    }

    private class Producer implements Runnable {
        private final List<Integer> localList;
        private final ArrayList<Hashtable<String, String>> localListFull;

        public Producer (List<Integer> inLocalList, ArrayList<Hashtable<String, String>> inLocalListFull) {
            localList = inLocalList;
            localListFull = inLocalListFull;

            overallCount = 0;
            queue.clear ();
        }

        @Override
        public void run () {
            Integer next;
            for (int path : this.localList) {
                next = path;
                try {
                    ParallelSearcher.this.queue.put (new ParallelSearcher.WorkItem (next, this.localListFull.get (next).get ("filename")));
                } catch (InterruptedException e) {
                    e.printStackTrace ();
                }
            }

            for (int i = 0; i < ParallelSearcher.this.numOfThreads * 3; i++) {
                try {
                    ParallelSearcher.this.queue.put (new ParallelSearcher.WorkItem (0, null));
                } catch (InterruptedException e) {
                    e.printStackTrace ();
                }
            }
        }
    }

    private class WorkItem {
        private final int fileNameId;
        private final String filename;

        WorkItem (int pathId, String filename) {
            fileNameId = pathId;
            this.filename = filename;
        }

        int getFileNameId () {
            return this.fileNameId;
        }

        String getFileName () {
            return this.filename;
        }
    }

    private class Consumer implements Runnable {
        private boolean locallyEnded;

        private final IndexReader indexReader;
        private final ArrayList<Hashtable<String, String>> localListFull;

        Consumer (IndexReader inIndexReader, ArrayList<Hashtable<String, String>> inLocalListFull) {
            localListFull = inLocalListFull;
            indexReader = inIndexReader;
            locallyEnded = false;
        }

        @Override
        public void run () {
            Gson gson = new Gson ();

            ParallelSearcher.WorkItem tmp = null;
            while (! this.locallyEnded) {
                try {
                    if (ParallelSearcher.this.queue.peek () == null) {
                        Thread.sleep ((long) ((Math.random () / 2 + 0.5) * 10000)); // sleep for a second if queue is empty.
                    }
                    tmp = ParallelSearcher.this.queue.take ();
                    if (tmp.getFileName () == null) this.locallyEnded = true;
                    else ParallelSearcher.this.overallCount++;
                    if (! this.locallyEnded) {
                        // search
                        Document document = indexReader.document (tmp.getFileNameId ());

                        //ImageSearcher searcher = new GenericFastImageSearcher(32, AutoColorCorrelogram.class, true, this.indexReader);
                        //ImageSearcher searcher = new GenericFastImageSearcher(32, CEDD.class, true, this.indexReader);
                        //ImageSearcher searcher = new GenericFastImageSearcher(32, Tamura.class, true, this.indexReader);
                        ImageSearcher searcher = new GenericFastImageSearcher (8, FCTH.class, true, indexReader);
                        ImageSearchHits hits = searcher.search (document, indexReader);

                        // rerank
                        System.out.println("---< filtering >-------------------------");

                        //RerankFilter filter = new RerankFilter(ColorLayout.class, DocumentBuilder.FIELD_NAME_COLORLAYOUT);
                        RerankFilter filter = new RerankFilter (CEDD.class, DocumentBuilder.FIELD_NAME_CEDD);
                        hits = filter.filter (hits, indexReader, document);

                        //System.out.println(docFile);

                        BufferedImage bimg = ImageIO.read (new File (tmp.getFileName ()));
                        int width = bimg.getWidth ();
                        int height = bimg.getHeight ();

                        localListFull.get (tmp.getFileNameId ()).put ("width", String.format ("%d", width));
                        localListFull.get (tmp.getFileNameId ()).put ("height", String.format ("%d", height));

                        Writer writer = new BufferedWriter (new OutputStreamWriter (new FileOutputStream (String.format ("build/index.manifest/%d.json", tmp.getFileNameId ()))));

//java.util.stream.Stream foop = Hash.stream(hits); //.stream();

                        writer.write (gson.toJson (hits));
                        writer.close ();

                        System.out.println("---< done >-------------------------");
                    }
                } catch (InterruptedException e) {
                  e.printStackTrace ();
                  System.exit(1);
                } catch (Exception e) {
                  e.printStackTrace ();
                  System.exit(1);
                }
            }
        }
    }

    public boolean search () {
        try {
            Thread p, c, m;
            p = new Thread (new Producer (allImageIds, rawIndex), "Producer");
            p.start ();
            LinkedList<Thread> threads = new LinkedList<Thread> ();
            for (int i = 0; i < this.numOfThreads; i++) {
                c = new Thread (new Consumer (indexReader, rawIndex), String.format ("Consumer-%02d", i + 1));
                c.start ();
                threads.add (c);
            }

            for (Thread thread : threads) {
                thread.join ();
            }
        } catch (InterruptedException e) {
            e.printStackTrace ();
        }

        return true;
    }

    public boolean hasEnded () {
        return this.searchingFinished;
    }
}
