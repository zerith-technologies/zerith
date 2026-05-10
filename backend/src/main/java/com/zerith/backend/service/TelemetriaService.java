package com.zerith.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zerith.backend.dto.TelemetriaRequest;
import com.zerith.backend.model.Telemetria;
import com.zerith.backend.repository.TelemetriaRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class TelemetriaService {

    private final TelemetriaRepository repository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Map<String, String[]> OBD_PID_MAP = new LinkedHashMap<>();
    static {
        OBD_PID_MAP.put("rpm",          new String[]{"0x0C", "engine_rpm", "rpm"});
        OBD_PID_MAP.put("speed",        new String[]{"0x0D", "speed_kmh",  "km/h"});
        OBD_PID_MAP.put("coolant_temp", new String[]{"0x05", "temp_c",     "°C"});
        OBD_PID_MAP.put("map_pressure", new String[]{"0x0B", "map_kpa",    "kPa"});
        OBD_PID_MAP.put("lambda",       new String[]{"0x24", "lambda",     "A/F"});
    }

    public TelemetriaService(TelemetriaRepository repository, SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    public Telemetria salvar(TelemetriaRequest request) {
        Telemetria t = new Telemetria();
        t.setTimestamp(request.getTimestamp());
        t.setPid(request.getPid());
        t.setName(request.getName());
        t.setValue(request.getValue());
        t.setUnit(request.getUnit());
        t.setRawBytes(request.getRawBytes());
        Telemetria saved = repository.save(t);
        messagingTemplate.convertAndSend("/topic/telemetry", saved);
        return saved;
    }

    public void handleMqttMessage(String payload) {
        try {
            JsonNode root      = objectMapper.readTree(payload);
            String vehicleId   = root.path("vehicle_id").asText();
            String timestampStr = root.path("timestamp").asText();
            JsonNode obd       = root.path("obd");

            Instant ts = Instant.parse(timestampStr);

            for (Map.Entry<String, String[]> entry : OBD_PID_MAP.entrySet()) {
                JsonNode fieldNode = obd.path(entry.getKey());
                if (fieldNode.isMissingNode() || fieldNode.isNull()) continue;
                String[] meta = entry.getValue();
                Telemetria saved = persist(ts, meta[0], meta[1], fieldNode.asDouble(), meta[2]);
                publishWs(saved, vehicleId);
            }

            JsonNode gps = root.path("gps");
            if (!gps.isMissingNode() && !gps.isNull()) {
                Map<String, Object> gpsMsg = new HashMap<>();
                gpsMsg.put("vehicleId", vehicleId);
                gpsMsg.put("timestamp", timestampStr);
                gpsMsg.put("lat", gps.path("lat").asDouble());
                gpsMsg.put("lng", gps.path("lng").asDouble());
                messagingTemplate.convertAndSend("/topic/gps", gpsMsg);
            }
        } catch (Exception ignored) {
            // Malformed MQTT payload — skip
        }
    }

    private Telemetria persist(Instant ts, String pid, String name, double value, String unit) {
        Telemetria t = new Telemetria();
        t.setTimestamp(ts);
        t.setPid(pid);
        t.setName(name);
        t.setValue(value);
        t.setUnit(unit);
        return repository.save(t);
    }

    private void publishWs(Telemetria t, String vehicleId) {
        Map<String, Object> msg = new HashMap<>();
        msg.put("id",        t.getId());
        msg.put("timestamp", t.getTimestamp().toString());
        msg.put("pid",       t.getPid());
        msg.put("name",      t.getName());
        msg.put("value",     t.getValue());
        msg.put("unit",      t.getUnit());
        msg.put("vehicleId", vehicleId);
        messagingTemplate.convertAndSend("/topic/telemetry", msg);
    }
}
