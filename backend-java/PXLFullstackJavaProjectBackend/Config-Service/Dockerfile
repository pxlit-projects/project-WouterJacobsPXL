# Use the official OpenJDK 17 image as the base image
FROM eclipse-temurin:21-jre-alpine

# Install curl
RUN apk add --no-cache curl

# Set working directory in the container
WORKDIR /app

# Copy the Maven target JAR file
COPY target/Config-Service-1.0-SNAPSHOT.jar config-service.jar

# Expose the port used by the service
EXPOSE 8088

# Run the jar file
ENTRYPOINT ["java", "-jar", "config-service.jar"]