# pictwourd

A photo indexing/searching prototype.

This project demonstrates several modes of Lucene image indexing technologies.

Given a directoy of images, Pictwourd will scan and index each image, ranking similar images and presenting them in a nifty static website.

# bootstrap sequence

* Gather collection of photos into `incoming/` dir

* Run "stash" local process to normalize input filenames

   `ruby stash-images.rb "/mnt/incoming/*" /mnt/stashed`

* Run "reindex" kubernetes job to index the images

   `kubectl apply -f kubernetes/reindex-images-job.yaml`

* Run "build and pack" kubernetes job to pre-build static website

   `kubectl apply -f kubernetes/build-and-pack-frontend-job.yaml`

* Run "static web server" kubernetes deployment to serve website

   `kubectl apply -f kubernetes/static-web-server-deployment.yaml`
