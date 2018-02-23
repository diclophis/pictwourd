//

import net.semanticmetadata.lire.builders.DocumentBuilder;

//import net.semanticmetadata.lire.builders.DocumentBuilderFactory;

//import net.semanticmetadata.lire.builders.GlobalDocumentBuilder;
//import net.semanticmetadata.lire.imageanalysis.features.global.AutoColorCorrelogram;
//import net.semanticmetadata.lire.imageanalysis.features.global.CEDD;
//import net.semanticmetadata.lire.imageanalysis.features.global.FCTH;

import net.semanticmetadata.lire.indexers.parallel.ParallelIndexer;
import net.semanticmetadata.lire.imageanalysis.features.global.*;
import net.semanticmetadata.lire.imageanalysis.features.global.joint.JointHistogram;


import net.semanticmetadata.lire.searchers.ImageSearchHits;
import net.semanticmetadata.lire.searchers.ImageSearcher;
import net.semanticmetadata.lire.searchers.GenericFastImageSearcher;
import net.semanticmetadata.lire.filters.RerankFilter;
import net.semanticmetadata.lire.utils.FileUtils;
import net.semanticmetadata.lire.utils.LuceneUtils;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.store.FSDirectory;

import java.io.InputStream;
import java.io.File;
import java.io.IOException;

import java.nio.file.Paths;

import com.google.gson.Gson;

import java.util.Hashtable;
import java.util.List;
import java.util.ArrayList;

public class Pictwourd {
  public static void main(String[] args) throws Exception {
    int numOfThreads = 8; // the number of thread used.
    // Checking if arg[0] is there and if it is a directory.
    boolean passed = false;
    if (args.length > 0) {
      File f = new File(args[0]);
      System.out.println("Indexing images in " + args[0]);
      if (f.exists() && f.isDirectory()) passed = true;
    }

    if (!passed) {
      System.out.println("No directory given as first argument.");
      System.out.println("Run \"ParallelIndexing <directory>\" to index files of a directory.");
      System.exit(1);
    }

		String indexPath = "index";
		String imagesPath = args[0];

      int count = 0;
      long time = System.currentTimeMillis();
      ParallelIndexer pin = new ParallelIndexer(8, indexPath, args[0]);

      pin.addExtractor(ColorLayout.class);
      pin.addExtractor(CEDD.class);
      pin.addExtractor(FCTH.class);
      pin.addExtractor(JCD.class);
      pin.addExtractor(ScalableColor.class);
      pin.addExtractor(EdgeHistogram.class);
      pin.addExtractor(AutoColorCorrelogram.class);
      pin.addExtractor(Tamura.class);
      pin.addExtractor(Gabor.class);
      pin.addExtractor(SimpleColorHistogram.class);
      pin.addExtractor(OpponentHistogram.class);
      pin.addExtractor(JointHistogram.class);
      pin.addExtractor(LuminanceLayout.class);
      pin.addExtractor(PHOG.class);

      //pin.addExtractor(ACCID.class);
      //pin.addExtractor(COMO.class);

      //pin.setCustomDocumentBuilder(MetadataBuilder.class);

      /*
      Thread t = new Thread(pin);
      t.start();
      while (!pin.hasEnded()) {
        float percentage = (float) pin.getPercentageDone();
        System.out.println(String.format("%f\n", percentage));
        Thread.currentThread().sleep(1000);
      }
      try {
          t.join();
      } catch (InterruptedException e) {
          e.printStackTrace();
      }
      */

    System.out.println("Finished indexing.");

    // search
    System.out.println("---< searching >-------------------------");
    IndexReader reader = DirectoryReader.open(FSDirectory.open(Paths.get(indexPath)));
    Document document = reader.document(6);
    ImageSearcher searcher = new GenericFastImageSearcher(32, AutoColorCorrelogram.class, true, reader);
    ImageSearchHits hits = searcher.search(document, reader);

    // rerank
    System.out.println("---< filtering >-------------------------");
    RerankFilter filter = new RerankFilter(ColorLayout.class, DocumentBuilder.FIELD_NAME_COLORLAYOUT);
    hits = filter.filter(hits, reader, document);

    // output
    FileUtils.saveImageResultsToHtml("filtertest", hits, document.getValues(DocumentBuilder.FIELD_NAME_IDENTIFIER)[0], reader);

    Gson gson = new Gson();
    
    ArrayList<Hashtable<String, String>> rawIndex = new ArrayList<Hashtable<String, String>>();

    for (int i = 0; i < reader.numDocs(); i++) {
      String docFile = reader.document(i).getValues(DocumentBuilder.FIELD_NAME_IDENTIFIER)[0];
      Hashtable<String, String> docu = new Hashtable<String, String>();
      docu.put("id", String.format("%d", i));
      docu.put("filename", docFile);
      rawIndex.add(docu);
    }

    System.out.println(gson.toJson(rawIndex));
    System.out.println(gson.toJson(hits));

    System.exit(0);
  }
}
