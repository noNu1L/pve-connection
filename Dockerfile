FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

COPY target/pve-connection.jar /app/pve-connection.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", \
  "-Xms32m", "-Xmx96m", \
  "-XX:MaxMetaspaceSize=64m", \
  "-Xss256k", \
  "-XX:+UseSerialGC", \
  "-XX:+UseContainerSupport", \
  "/app/pve-connection.jar"]
