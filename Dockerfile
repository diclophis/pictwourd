#FROM anapsix/alpine-java
#
#ADD lib /opt/lib
#
#CMD ["java", "-h"]

#FROM sbtscala/scala-sbt:eclipse-temurin-18.0.2_1.8.0_3.2.0
#FROM sbtscala/scala-sbt:eclipse-temurin-11.0.16_1.8.0_3.2.0
FROM sbtscala/scala-sbt:openjdk-17.0.2_1.8.0_3.2.0

ADD . /opt/build

RUN cd /opt/build && sbt compile
