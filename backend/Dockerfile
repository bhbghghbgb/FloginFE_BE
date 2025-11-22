# -----------------------------------------------------------------
# STAGE 1: Build the Java application (Build Stage)
# Use a specific Maven image with a JDK for building
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the entire backend source code
COPY . /app

# Package the application. This runs unit tests during the build.
# -DskipTests skips the unit tests here so they can be run in a separate 'unit-test' stage/job.
# However, since unit tests are fast and crucial for the artifact, we run them here by default.
RUN mvn clean package -DskipTests=false

# -----------------------------------------------------------------
# STAGE 2: Create the minimal runtime image (Production Stage)
# Use a much smaller JRE image for the final container
FROM eclipse-temurin:21-jre-alpine

# Set arguments for the JAR file name
ARG JAR_FILE=target/*.jar

# Copy the packaged JAR file from the build stage
COPY --from=build /app/${JAR_FILE} app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# The command to run the application
ENTRYPOINT ["java", "-jar", "/app.jar"]