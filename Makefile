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

all:
	echo $(classes)

reset:
	rm -Rf index index.config index.manifest

run: $(classes)
	$(JAVA) -Xmx3600m -classpath $(jars_list):$(BUILD) Pictwourd /home/ubuntu/pictwourd/index.attic

clean:
	rm -Rf $(BUILD)
	mkdir -p $(BUILD)

$(BUILD)/%.class: %.java
	$(JAVAC) -Xlint:unchecked -cp $(jars_list):. -d $(BUILD) -sourcepath src $<
