//

import net.semanticmetadata.lire.builders.DocumentBuilder;
//import net.semanticmetadata.lire.builders.DocumentBuilderFactory;

import net.semanticmetadata.lire.builders.GlobalDocumentBuilder;
import net.semanticmetadata.lire.imageanalysis.features.global.AutoColorCorrelogram;
import net.semanticmetadata.lire.imageanalysis.features.global.CEDD;
import net.semanticmetadata.lire.imageanalysis.features.global.FCTH;

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

    // use ParallelIndexer to index all photos from args[0] into "index" ... use 6 threads (actually 7 with the I/O thread).
    ParallelIndexer indexer = new ParallelIndexer(numOfThreads, "index", args[0]);
    // use this to add you preferred builders. For now we go for CEDD, FCTH and AutoColorCorrelogram
    indexer.addExtractor(CEDD.class);
    indexer.addExtractor(FCTH.class);
    indexer.addExtractor(AutoColorCorrelogram.class);
    indexer.run();

    System.out.println("Finished indexing.");
    System.exit(0);
  }
}
