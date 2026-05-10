FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

COPY target/pve-connection.jar /app/pve-connection.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "-Xms256m", "-XX:MaxMetaspaceSize=256m", "-Xss2m", "/app/pve-connection.jar"]
