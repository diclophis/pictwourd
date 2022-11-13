# pictwourd

A photo indexing/searching prototype.

# bootstrap sequence

* Gather collection of photos into `incoming/` dir

* Run "stash" local process to normalize input filenames

   `ruby stash-images.rb "/mnt/incoming/*" /mnt/stashed`

* Run "reindex" kubernetes job to index the images

# deprecation notes

* https://github.com/sbt/sbt/issues/6558
