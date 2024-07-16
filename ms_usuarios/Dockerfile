# syntax=docker/dockerfile:1

#Will build the JAR
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /usr/src/ms_users

COPY ./pom.xml ./pom.xml

#Install dependencies from pom
RUN mvn dependency:go-offline

COPY ./src ./src

#Creates the JAR 
RUN mvn clean install

################

FROM eclipse-temurin:17-jre-ubi9-minimal AS runner

WORKDIR /usr/src/ms_users

EXPOSE 8070

#Must be executed after building because it requires a database (depends_on can't be used when building)
#UPDATE: Deleted test that required database when building

#Copy jar from builder

COPY --from=builder /usr/src/ms_users/target/*.jar /usr/src/ms_users/*.jar

ENTRYPOINT ["java", "-jar", "/usr/src/ms_users/*.jar"]
