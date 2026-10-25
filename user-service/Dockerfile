
FROM eclipse-temurin:21-jdk-alpine

LABEL service="user-service"

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8085

ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=docker"]
