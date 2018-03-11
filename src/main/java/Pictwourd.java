//

import net.semanticmetadata.lire.builders.DocumentBuilder;

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
import java.io.*;

import java.nio.file.Paths;

import com.google.gson.Gson;

import java.util.Hashtable;
import java.util.List;
import java.util.ArrayList;

public class Pictwourd {
  public static void main(String[] args) throws Exception {
    int numOfThreads = 16; // the number of thread used.
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

		String indexPath = "build/index";
		String imagesPath = args[0];
		boolean shouldReindexImages = true;
		boolean shouldSearchImages = true;
		boolean shouldManifestImages = true;

    //if (args.length == 2) {
		//  shouldReindexImages = args[1];
    //}

    long time = System.currentTimeMillis();
    ParallelIndexer pin = new ParallelIndexer(numOfThreads, indexPath, args[0]);

    //pin.addExtractor(ColorLayout.class);
    //pin.addExtractor(AutoColorCorrelogram.class);
    //pin.addExtractor(JointHistogram.class);

    //pin.addExtractor(Tamura.class);

    pin.addExtractor(FCTH.class);
    pin.addExtractor(CEDD.class);

/*
    pin.addExtractor(JCD.class);
    pin.addExtractor(ScalableColor.class);
    pin.addExtractor(EdgeHistogram.class);
    pin.addExtractor(Gabor.class);
    pin.addExtractor(SimpleColorHistogram.class);
    pin.addExtractor(OpponentHistogram.class);
    pin.addExtractor(LuminanceLayout.class);
    pin.addExtractor(PHOG.class);
*/

    //pin.addExtractor(ACCID.class);
    //pin.addExtractor(COMO.class);
    //pin.setCustomDocumentBuilder(MetadataBuilder.class);

    if (shouldReindexImages) {
      System.out.println("---< indexing >-------------------------");
      Thread t = new Thread(pin);
      t.start();
      while (!pin.hasEnded()) {
        float percentage = (float) pin.getPercentageDone();
        System.out.println(String.format("%f\n", percentage));
        Thread.currentThread().sleep(3000);
      }
      try {
          t.join();
      } catch (InterruptedException e) {
          e.printStackTrace();
      }
    }

    System.out.println("---< searching >-------------------------");
    IndexReader reader = DirectoryReader.open(FSDirectory.open(Paths.get(indexPath)));

    ParallelSearcher search = new ParallelSearcher(reader);

    if (shouldSearchImages) {
      Thread t = new Thread(search);
      t.start();
      while (!search.hasEnded()) {
        Thread.currentThread().sleep(3000);
      }
      try {
          t.join();
      } catch (InterruptedException e) {
          e.printStackTrace();
      }
    }

    if (shouldManifestImages) {
      File indexManifestDir = new File("build/index.manifest");
      indexManifestDir.mkdir();

      Writer writer = new BufferedWriter(
                        new OutputStreamWriter(
                          new FileOutputStream(
                            String.format("build/index.manifest/manifest.json")
                          )
                        )
                      );

      Gson gson = new Gson();
      writer.write(gson.toJson(search.getRawIndex()));
      writer.close();
    }

    System.exit(0);
  }
}
