# ── Stage 1: Build com Maven ─────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build

# Copia o Maven Wrapper primeiro (camada de cache separada)
COPY .mvn .mvn
COPY mvnw ./
RUN chmod +x mvnw

# Baixa dependências (camada de cache; só re-executa se pom.xml mudar)
COPY pom.xml ./
RUN ./mvnw dependency:go-offline -q

# Compila (pula testes: ambiente CI/CD roda testes separadamente)
COPY src ./src
RUN ./mvnw package -DskipTests -q

# ── Stage 2: Runtime com JRE slim ────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=builder /build/target/backend-*.jar app.jar
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["/docker-entrypoint.sh"]
