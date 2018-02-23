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

all: $(classes)

run: all
	$(JAVA) -Xmx400m -classpath $(jars_list):$(BUILD) Pictwourd /home/ubuntu/TestImages

clean:
	rm -Rf $(BUILD)
	mkdir -p $(BUILD)

$(BUILD)/%.class: %.java
	$(JAVAC) -Xlint:unchecked -cp $(jars_list):. -d $(BUILD) -sourcepath src $<
