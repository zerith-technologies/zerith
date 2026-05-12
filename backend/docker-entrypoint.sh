#!/bin/sh
set -e

# Render injeta DATABASE_URL no formato postgres://user:pass@host:port/dbname
# O Spring Boot precisa do formato JDBC: jdbc:postgresql://host:port/dbname
# Este script faz a conversão e exporta as variáveis antes de iniciar o JAR.
if [ -n "$DATABASE_URL" ]; then
  REST=$(echo "$DATABASE_URL" | sed 's|^postgres://||;s|^postgresql://||')
  USERPASS=$(echo "$REST" | cut -d@ -f1)
  HOSTDB=$(echo "$REST"   | cut -d@ -f2)

  DB_USER=$(echo "$USERPASS" | cut -d: -f1)
  DB_PASS=$(echo "$USERPASS" | cut -d: -f2)
  HOST=$(echo "$HOSTDB"     | cut -d: -f1)
  PORTDB=$(echo "$HOSTDB"   | cut -d: -f2)
  PORT_NUM=$(echo "$PORTDB" | cut -d/ -f1)
  DB_NAME=$(echo "$PORTDB"  | cut -d/ -f2)

  export SPRING_DATASOURCE_URL="jdbc:postgresql://${HOST}:${PORT_NUM}/${DB_NAME}"
  export SPRING_DATASOURCE_USERNAME="$DB_USER"
  export SPRING_DATASOURCE_PASSWORD="$DB_PASS"
fi

exec java -jar /app/app.jar
