# basic make
EMPTY :=
SPACE := $(EMPTY) $(EMPTY)
BUILD=build

#NOTE: override these at execution time
INCOMING ?= /mnt/b/Incoming/nasa/EVA/*
#INCOMING ?= /home/ubuntu/TestImages/*
ATTIC ?= /home/ubuntu/pictwourd/build/index.attic
BOXES = $(patsubst %,%.rsync, $(subst $(ATTIC),$(BUILD)/index.attic, $(wildcard $(ATTIC)/*)))

REPO ?= localhost/
IMAGE_NAME ?= pictwourd
IMAGE_TAG ?= $(strip $(shell find src -type f | xargs shasum | sort | shasum | cut -f1 -d" "))

IMAGE = $(REPO)$(IMAGE_NAME):$(IMAGE_TAG)

.PHONY: index stash reset all image uninstall clean test

all:
	echo $(BUILD)/$(IMAGE_TAG)
	echo $(BOXES)

pipeline: fetch

#TODO
#reset:
#	rm -Rf $(BUILD)/index $(BUILD)/index.config $(BUILD)/index.manifest

#$(BUILD)/index.attic/%.rsync: stash
#	rsync -azPr $(BUILD)/index.attic/$* ubuntu@ops.bardin.haus:/home/ubuntu/pictwourd/build/index.attic

#just-fetch:
#	rm -Rf $(BUILD)/*js $(BUILD)/*html
#	ssh -t ubuntu@ops.bardin.haus 'cd /home/ubuntu/pictwourd; rm -Rf rm -Rf $(BUILD)/*js $(BUILD)/*html; npm run build && npm run pack'
#	rsync -azPr ubuntu@ops.bardin.haus:/home/ubuntu/pictwourd/build/{*.html,*js,*css} $(BUILD)
#	firefox http://localhost:8000

fetch: index $(BOXES)
	rm -Rf $(BUILD)/*js $(BUILD)/*html
	ssh -t ubuntu@ops.bardin.haus 'cd /home/ubuntu/pictwourd; rm -Rf rm -Rf $(BUILD)/*js $(BUILD)/*html; npm run build && npm run pack'
	rsync -azPr ubuntu@ops.bardin.haus:/home/ubuntu/pictwourd/build/{*.html,*js,*css} $(BUILD)
	firefox http://localhost:8000

#001
#stash:
#	ruby stash-images.rb "$(INCOMING)"

#002
#index: stash
#	env JAVA_OPTS="-Xmx3600m" sbt "run $(ATTIC)"
#	echo -n Syncing Index && rsync -azPr --exclude build/index.attic build ubuntu@ops.bardin.haus:/home/ubuntu/pictwourd

#clean:
#	rm -Rf $(BUILD)

#image:
#	docker build -f Dockerfile -t $(IMAGE) .

#$(BUILD)/$(IMAGE_TAG): image
#	touch $(BUILD)/$(IMAGE_TAG)
