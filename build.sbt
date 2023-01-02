lazy val root = (project in file("."))

name := """pictwourd"""

version := "0.1.x"

// Do not append Scala versions to the generated artifacts
crossPaths := false

// This forbids including Scala related libraries into the dependency
autoScalaLibrary := false


mainClass in (Compile,run) := Some("Pictwourd")

libraryDependencies += "commons-codec" % "commons-codec" % "1.11"
libraryDependencies += "commons-io" % "commons-io" % "2.6"
libraryDependencies += "org.apache.commons" % "commons-math3" % "3.6.1"
libraryDependencies += "com.google.code.gson" % "gson" % "2.8.2"
libraryDependencies += "org.apache.lucene" % "lucene-analyzers-common" % "5.2.1"
libraryDependencies += "org.apache.lucene" % "lucene-core" % "5.2.1"
libraryDependencies += "com.drewnoakes" % "metadata-extractor" % "2.11.0"
