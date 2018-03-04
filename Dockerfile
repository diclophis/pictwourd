FROM anapsix/alpine-java

ADD lib /opt/lib

CMD ["java", "-h"]
