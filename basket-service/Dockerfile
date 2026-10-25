# FROM eclipse-temurin:21-jdk-alpine
# WORKDIR /app
# COPY target/basket-service-1.0-SNAPSHOT.jar app.jar
# EXPOSE 8082
# ENTRYPOINT ["java","-jar","app.jar"]
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java","-jar","app.jar"]
