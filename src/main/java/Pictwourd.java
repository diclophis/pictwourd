//

import net.semanticmetadata.lire.indexers.parallel.ParallelIndexer;
import net.semanticmetadata.lire.imageanalysis.features.global.*;

import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.store.FSDirectory;

import java.io.*;
import java.nio.file.Paths;

import com.google.gson.Gson;

import static java.lang.String.*;

public class Pictwourd {
    public static void main (String[] args) throws Exception {
        String indexPath = "build/index";
        String imagesPath = null;

        int numOfThreads = 16; // the number of thread used.

        // Checking if arg[0] is there and if it is a directory.
        boolean passed = false;
        if (args.length > 0) {
            imagesPath = args[0];

            File f = new File (imagesPath);
            System.out.println ("Indexing images in " + imagesPath);
            if (f.exists () && f.isDirectory ()) passed = true;
        }

        if (! passed) {
            System.out.println ("No directory given as first argument.");
            System.out.println ("Run \"ParallelIndexing <directory>\" to index files of a directory.");
            System.exit (1);
        }


        boolean shouldReindexImages = true;
        boolean shouldSearchImages = true;
        boolean shouldManifestImages = true;


        ParallelIndexer pin = new ParallelIndexer (numOfThreads, indexPath, imagesPath);

        //pin.addExtractor(ColorLayout.class);
        //pin.addExtractor(AutoColorCorrelogram.class);
        //pin.addExtractor(JointHistogram.class);

        //pin.addExtractor(Tamura.class);

        pin.addExtractor (FCTH.class);
        pin.addExtractor (CEDD.class);

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
            System.out.println ("---< indexing >-------------------------");
            Thread t = new Thread (pin);
            t.start ();
            while (! pin.hasEnded ()) {
                float percentage = (float) pin.getPercentageDone ();
                System.out.println (format ("%f\n", percentage));
                Thread.sleep (3000);
            }
            try {
                t.join ();
            } catch (InterruptedException e) {
                e.printStackTrace ();
            }
        }

        System.out.println ("---< searching >-------------------------");
        IndexReader reader = DirectoryReader.open (FSDirectory.open (Paths.get (indexPath)));

        ParallelSearcher search = new ParallelSearcher (reader);

        if (shouldSearchImages) {
            Thread t = new Thread (search);
            t.start ();
            while (! search.hasEnded ()) {
                Thread.sleep (3000);
            }
            try {
                t.join ();
            } catch (InterruptedException e) {
                e.printStackTrace ();
            }
        }

        if (shouldManifestImages) {
            File indexManifestDir = new File ("build/index.manifest");
            if (indexManifestDir.mkdir ()) {
                Writer writer = new BufferedWriter (
                    new OutputStreamWriter (
                        new FileOutputStream ("build/index.manifest/manifest.json")
                    )
                );

                Gson gson = new Gson ();
                writer.write (gson.toJson (search.getRawIndex ()));
                writer.close ();
            }
        }

        System.exit (0);
    }
}
