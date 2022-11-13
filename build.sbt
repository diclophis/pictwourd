lazy val root = (project in file("."))

name := """pictwourd"""

version := "0.1.x"

// Do not append Scala versions to the generated artifacts
crossPaths := false

// This forbids including Scala related libraries into the dependency
autoScalaLibrary := false


mainClass in (Compile,run) := Some("Pictwourd")

//commons-codec-1.10.jar
//commons-io-2.4.jar
//commons-math3-3.2.jar
//gson-2.8.2.jar
//jopensurf-src.jar
//jopensurf.jar
//lire.jar
//lucene-analyzers-common-5.2.1.jar
//lucene-core-5.2.1.jar
//lucene-queryparser-5.2.1.jar
//metadata-extractor-2.11.0.jar
//opencv
//opencv-2411.jar

//libraryDependencies += "org.webjars" %% "webjars-play" % "2.6.1"
// 
// libraryDependencies += "org.gnieh" %% f"diffson-play-json" % "2.2.4"
// 
// libraryDependencies += "com.typesafe.akka" %% "akka-slf4j" % akkaVersion
// 
// libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "3.1.2" % Test
// libraryDependencies += "com.typesafe.akka" %% "akka-testkit" % akkaVersion % Test
// libraryDependencies += "com.typesafe.akka" %% "akka-stream-testkit" % akkaVersion % Test

libraryDependencies += "commons-codec" % "commons-codec" % "1.11"
libraryDependencies += "commons-io" % "commons-io" % "2.6"
libraryDependencies += "org.apache.commons" % "commons-math3" % "3.6.1"
libraryDependencies += "com.google.code.gson" % "gson" % "2.8.2"
libraryDependencies += "org.apache.lucene" % "lucene-analyzers-common" % "5.2.1"
libraryDependencies += "org.apache.lucene" % "lucene-core" % "5.2.1"
//libraryDependencies += "org.apache.lucene" % "lucene-query-parser" % "5.2.1"
libraryDependencies += "com.drewnoakes" % "metadata-extractor" % "2.11.0"


//libraryDependencies += "com.sangupta" % "jopensurf" % "1.0.0"
