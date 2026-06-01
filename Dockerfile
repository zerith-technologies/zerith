# ================================================================
# ZERITH Backend — Dockerfile multi-stage (otimizado para Render)
# ================================================================

# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache de dependências (rebuild só quando pom.xml muda)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia código e compila sem testes (testes rodam no CI)
COPY src ./src
RUN mvn package -DskipTests -B

# ----------------------------------------------------------------
# Stage 2: Runtime (imagem mínima)
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

# Usuário não-root por segurança
RUN addgroup -S zerith && adduser -S zerith -G zerith
USER zerith

# Copia apenas o JAR compilado
COPY --from=builder /app/target/*.jar app.jar

# Health check para o Render
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget -qO- http://localhost:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
