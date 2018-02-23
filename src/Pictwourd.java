//

//import net.semanticmetadata.lire.builders.DocumentBuilder;
//import net.semanticmetadata.lire.builders.DocumentBuilderFactory;

//import net.semanticmetadata.lire.builders.GlobalDocumentBuilder;
//import net.semanticmetadata.lire.imageanalysis.features.global.AutoColorCorrelogram;
//import net.semanticmetadata.lire.imageanalysis.features.global.CEDD;
//import net.semanticmetadata.lire.imageanalysis.features.global.FCTH;

import net.semanticmetadata.lire.indexers.parallel.ParallelIndexer;
import net.semanticmetadata.lire.imageanalysis.features.global.*;
import net.semanticmetadata.lire.imageanalysis.features.global.joint.JointHistogram;

import java.io.InputStream;
import java.io.File;
import java.io.IOException;

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

      int count = 0;
      long time = System.currentTimeMillis();
      ParallelIndexer pin = new ParallelIndexer(8, "index", args[0]);

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

    System.out.println("Finished indexing.");
    System.exit(0);
  }
}
