# Use the official OpenJDK 17 image as the base image
FROM eclipse-temurin:21-jre-alpine

# Set working directory in the container
WORKDIR /app

# Install curl
RUN apk add --no-cache curl

# Copy the Maven target JAR file
COPY target/Discovery-Service-1.0-SNAPSHOT.jar discovery-service.jar

# Expose the port used by the Discovery Service
EXPOSE 8761

# Run the jar file
ENTRYPOINT ["java", "-jar", "discovery-service.jar"]