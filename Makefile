# basic make
EMPTY :=
SPACE := $(EMPTY) $(EMPTY)

JAVA=java
JAVAC=javac
BUILD=build
jars = $(wildcard lib/*.jar)
jars_list = $(subst $(SPACE),:,$(jars))
sources = $(wildcard src/*.java)
dot_class = $(sources:.java=.class)
classes = $(patsubst %,build/%, $(dot_class))

#NOTE: override these at execution time
REPO ?= localhost/
IMAGE_NAME ?= pictwourd
IMAGE_TAG ?= $(strip $(shell find src -type f | xargs shasum | sort | shasum | cut -f1 -d" "))
IMAGE = $(REPO)$(IMAGE_NAME):$(IMAGE_TAG)

$(shell mkdir -p $(BUILD))

#MANIFEST_TMP=$(BUILD)/manifest.yml

.PHONY: image uninstall clean test

all:
	echo $(classes)
	echo $(BUILD)/$(IMAGE_TAG)

pipeline: build run sync fetch

reset:
	rm -Rf $(BUILD)/index $(BUILD)/index.config $(BUILD)/index.manifest

sync:
	rsync -azP -v -r $(BUILD) ubuntu@ops.bardin.haus:/home/ubuntu/pictwourd/

fetch:
	rm -Rf $(BUILD)/*js $(BUILD)/*html
	ssh -t ubuntu@ops.bardin.haus 'cd /home/ubuntu/pictwourd; rm -Rf rm -Rf $(BUILD)/*js $(BUILD)/*html; npm run build && npm run pack'
	rsync -azP -v -r ubuntu@ops.bardin.haus:/home/ubuntu/pictwourd/build/{*.html,*js} $(BUILD)
	firefox http://localhost:8000

build: $(classes)

run: $(classes)
	$(JAVA) -Xmx3600m -classpath $(jars_list):$(BUILD) Pictwourd /home/ubuntu/pictwourd/build/index.attic

clean:
	rm -Rf $(BUILD)/*class

$(BUILD)/%.class: %.java
	$(JAVAC) -Xlint:unchecked -Xdiags:verbose -cp $(jars_list):. -d $(BUILD) -sourcepath src $<

image:
	docker build -f Dockerfile -t $(IMAGE) .

$(BUILD)/$(IMAGE_TAG): image
	touch $(BUILD)/$(IMAGE_TAG)
