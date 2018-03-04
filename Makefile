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
IMAGE_TAG ?= $(strip $(shell find src build -type f | xargs shasum | sort | shasum | cut -f1 -d" "))
IMAGE = $(REPO)$(IMAGE_NAME):$(IMAGE_TAG)

$(shell mkdir -p $(BUILD))

#MANIFEST_TMP=$(BUILD)/manifest.yml

.PHONY: image uninstall clean test

all:
	echo $(classes)
	echo $(BUILD)/$(IMAGE_TAG)

reset:
	rm -Rf index index.config index.manifest

run: $(classes)
	$(JAVA) -Xmx3600m -classpath $(jars_list):$(BUILD) Pictwourd /home/ubuntu/pictwourd/index.attic

clean:
	rm -Rf $(BUILD)
	mkdir -p $(BUILD)

$(BUILD)/%.class: %.java
	$(JAVAC) -Xlint:unchecked -cp $(jars_list):. -d $(BUILD) -sourcepath src $<

image:
	docker build -f Dockerfile -t $(IMAGE) .

$(BUILD)/$(IMAGE_TAG): image
	touch $(BUILD)/$(IMAGE_TAG)
