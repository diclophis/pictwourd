# https://hub.docker.com/r/sbtscala/scala-sbt/tags
FROM sbtscala/scala-sbt:openjdk-8u342_1.8.0_3.2.0

ADD . /opt/build

RUN cd /opt/build && sbt compile

WORKDIR /opt/build
