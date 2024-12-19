# Use the official OpenJDK 17 image as the base image
FROM eclipse-temurin:21-jre-alpine

# Install curl
RUN apk add --no-cache curl

# Set working directory in the container
WORKDIR /app

# Copy the Maven target JAR file
COPY target/api-gateway-1.0-SNAPSHOT.jar api-gateway.jar

# Expose the port used by the API Gateway
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "api-gateway.jar"]