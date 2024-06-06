# syntax=docker/dockerfile:1

#Will build the JAR
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /usr/src/ms_auth

COPY ./pom.xml ./pom.xml

#Install dependencies from pom
RUN mvn dependency:go-offline

COPY ./src ./src

#Creates the JAR 
RUN mvn clean install

#################################

FROM eclipse-temurin:17-jre-ubi9-minimal AS runner

WORKDIR /usr/src/ms_auth

EXPOSE 8040

#Copy jar from builder
COPY --from=builder /usr/src/ms_auth/target/*.jar /usr/src/ms_auth/*.jar

ENTRYPOINT ["java", "-jar", "/usr/src/ms_auth/*.jar"]
