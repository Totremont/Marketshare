# syntax=docker/dockerfile:1

#Will build the JAR
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /usr/src/ms_users

COPY ./pom.xml ./pom.xml

#Install dependencies from pom
RUN mvn dependency:go-offline

COPY ./src ./src

EXPOSE 8070

#Must be executed after building because it requires a database (depends_on can't be used when building)
ENTRYPOINT mvn clean install && java -jar /usr/src/ms_users/target/*.jar
