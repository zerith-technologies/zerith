#!/bin/bash
# Simula o obd_reader enviando dados para o Spring Boot

PIDS=("0x0B:map_kpa:kPa" "0x24:lambda_af_ratio:A/F" "0x0C:rpm:rpm" "0x0D:speed_kmh:km/h" "0x05:coolant_temp_c:°C")

while true; do
  for entry in "${PIDS[@]}"; do
    PID=$(echo $entry | cut -d: -f1)
    NAME=$(echo $entry | cut -d: -f2)
    UNIT=$(echo $entry | cut -d: -f3)
    VALUE=$(awk 'BEGIN{srand(); print int(rand()*200)+10}')
    
    curl -s -X POST http://localhost:8080/api/telemetry \
      -H "Content-Type: application/json" \
      -d "{\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"pid\":\"$PID\",\"name\":\"$NAME\",\"value\":$VALUE,\"unit\":\"$UNIT\",\"raw_bytes\":\"00000000\"}" \
      > /dev/null
    
    sleep 0.2
  done
  sleep 1
done
