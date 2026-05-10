package com.zerith.backend.service;

import com.zerith.backend.model.Telemetria;
import com.zerith.backend.repository.TelemetriaRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GestaoService {

    private final TelemetriaRepository repository;

    // [id, nome, motorista, placa]
    private static final String[][] FLEET = {
        {"mobi",    "Fiat Mobi",   "Carlos Mendes", "PBM-3421"},
        {"saveiro", "VW Saveiro",  "Ana Paula",     "QCX-7890"},
        {"polo",    "VW Polo",     "Roberto Lima",  "RTD-5566"},
        {"strada",  "Fiat Strada", "Marcos Souza",  "SYE-1234"},
        {"argo",    "Fiat Argo",   "Juliana Costa", "TZA-4321"},
    };

    private static final Map<String, String> VEHICLE_NAMES = new HashMap<>();
    private static final Map<String, String> PID_TYPE = Map.of(
        "0x0D", "Velocidade excessiva",
        "0x05", "Temperatura elevada",
        "0x0C", "RPM elevado",
        "0x24", "Lambda fora do range"
    );

    static {
        for (String[] v : FLEET) VEHICLE_NAMES.put(v[0], v[1]);
    }

    public GestaoService(TelemetriaRepository repository) {
        this.repository = repository;
    }

    // ── Dashboard ─────────────────────────────────────────────────────────────

    public Map<String, Object> getDashboard() {
        long totalLeituras   = repository.count();
        long veiculosAtivos  = toLongMap(repository.countByVehicle()).size();
        long alertasDanger   = repository.countDangerEvents();
        long alertasWarning  = repository.countWarningEvents();

        Map<String, Long> speedAlerts = toLongMap(repository.countSpeedAlerts());
        Map<String, Long> tempAlerts  = toLongMap(repository.countTempAlerts());
        Map<String, Long> rpmAlerts   = toLongMap(repository.countRpmAlerts());

        List<Map<String, Object>> scores = new ArrayList<>();
        for (String[] v : FLEET) {
            long anomalies = speedAlerts.getOrDefault(v[0], 0L)
                + tempAlerts.getOrDefault(v[0], 0L)
                + rpmAlerts.getOrDefault(v[0], 0L);
            scores.add(Map.of(
                "vehicleId", v[0],
                "nome", v[1],
                "score", calcScore(anomalies)
            ));
        }

        return Map.of(
            "totalLeituras",  totalLeituras,
            "veiculosAtivos", veiculosAtivos,
            "alertasDanger",  alertasDanger,
            "alertasWarning", alertasWarning,
            "scores",         scores
        );
    }

    // ── Motoristas ────────────────────────────────────────────────────────────

    public List<Map<String, Object>> getMotoristas() {
        Map<String, Long>   byVehicle   = toLongMap(repository.countByVehicle());
        Map<String, Long>   speedAlerts = toLongMap(repository.countSpeedAlerts());
        Map<String, Long>   tempAlerts  = toLongMap(repository.countTempAlerts());
        Map<String, Long>   rpmAlerts   = toLongMap(repository.countRpmAlerts());
        Map<String, Double> sumSpeed    = toDoubleMap(repository.sumSpeedByVehicle());

        List<Map<String, Object>> result = new ArrayList<>();
        for (String[] v : FLEET) {
            String id      = v[0];
            long   alertas = speedAlerts.getOrDefault(id, 0L)
                + tempAlerts.getOrDefault(id, 0L)
                + rpmAlerts.getOrDefault(id, 0L);
            double km      = sumSpeed.getOrDefault(id, 0.0) / 3600.0;

            result.add(mapOf(
                "id",            id,
                "nome",          v[2],
                "veiculo",       v[1],
                "placa",         v[3],
                "score",         calcScore(alertas),
                "alertas",       alertas,
                "kmRodados",     round1(km),
                "status",        levelFromCount(alertas),
                "totalLeituras", byVehicle.getOrDefault(id, 0L)
            ));
        }
        return result;
    }

    // ── Veículos ──────────────────────────────────────────────────────────────

    public List<Map<String, Object>> getVeiculos() {
        Map<String, Double> avgSpeed  = toDoubleMap(repository.avgByVehicleAndPid("0x0D"));
        Map<String, Double> avgRpm    = toDoubleMap(repository.avgByVehicleAndPid("0x0C"));
        Map<String, Double> avgTemp   = toDoubleMap(repository.avgByVehicleAndPid("0x05"));
        Map<String, Double> maxSpeed  = toDoubleMap(repository.maxByVehicleAndPid("0x0D"));
        Map<String, Long>   byVehicle = toLongMap(repository.countByVehicle());
        Map<String, Long>   speedAlerts = toLongMap(repository.countSpeedAlerts());
        Map<String, Long>   tempAlerts  = toLongMap(repository.countTempAlerts());

        List<Map<String, Object>> result = new ArrayList<>();
        for (String[] v : FLEET) {
            String id      = v[0];
            long   alertas = speedAlerts.getOrDefault(id, 0L) + tempAlerts.getOrDefault(id, 0L);
            result.add(mapOf(
                "id",            id,
                "nome",          v[1],
                "placa",         v[3],
                "velMedia",      round1(avgSpeed.getOrDefault(id, 0.0)),
                "rpmMedio",      round1(avgRpm.getOrDefault(id, 0.0)),
                "tempMedia",     round1(avgTemp.getOrDefault(id, 0.0)),
                "velMax",        round1(maxSpeed.getOrDefault(id, 0.0)),
                "totalLeituras", byVehicle.getOrDefault(id, 0L),
                "status",        levelFromCount(alertas)
            ));
        }
        return result;
    }

    // ── Financeiro ────────────────────────────────────────────────────────────

    public Map<String, Object> getFinanceiro() {
        Map<String, Double> sumSpeed = toDoubleMap(repository.sumSpeedByVehicle());

        double kmTotal = 0;
        List<Map<String, Object>> porVeiculo = new ArrayList<>();
        for (String[] v : FLEET) {
            double km      = sumSpeed.getOrDefault(v[0], 0.0) / 3600.0;
            double consumo = km * 9.0 / 100.0;
            double custo   = consumo * 6.00;
            kmTotal += km;
            porVeiculo.add(mapOf(
                "id",      v[0],
                "nome",    v[1],
                "km",      round1(km),
                "consumo", round1(consumo),
                "custo",   round2(custo)
            ));
        }

        return Map.of(
            "kmTotal",      round1(kmTotal),
            "custoTotal",   round2(kmTotal * 9.0 / 100.0 * 6.00),
            "consumoMedio", 9.0,
            "precoLitro",   6.00,
            "porVeiculo",   porVeiculo
        );
    }

    // ── Manutenção ────────────────────────────────────────────────────────────

    public List<Map<String, Object>> getManutencao() {
        Map<String, Long> speedAlerts  = toLongMap(repository.countSpeedAlerts());
        Map<String, Long> tempAlerts   = toLongMap(repository.countTempAlerts());
        Map<String, Long> rpmAlerts    = toLongMap(repository.countRpmAlerts());
        Map<String, Long> lambdaAlerts = toLongMap(repository.countLambdaAlerts());

        List<Map<String, Object>> result = new ArrayList<>();
        for (String[] v : FLEET) {
            addIfNonZero(result, v[0], v[1], "Velocidade excessiva",  speedAlerts);
            addIfNonZero(result, v[0], v[1], "Temperatura elevada",   tempAlerts);
            addIfNonZero(result, v[0], v[1], "RPM elevado",           rpmAlerts);
            addIfNonZero(result, v[0], v[1], "Lambda fora do range",  lambdaAlerts);
        }
        result.sort((a, b) -> Long.compare((Long) b.get("ocorrencias"), (Long) a.get("ocorrencias")));
        return result;
    }

    // ── Ocorrências ───────────────────────────────────────────────────────────

    public List<Map<String, Object>> getOcorrencias() {
        List<Telemetria> anomalies = repository.findAllAnomalies(PageRequest.of(0, 50));
        return anomalies.stream().map(t -> mapOf(
            "id",        t.getId(),
            "vehicleId", t.getVehicleId() != null ? t.getVehicleId() : "",
            "veiculo",   VEHICLE_NAMES.getOrDefault(t.getVehicleId(), t.getVehicleId()),
            "pid",       t.getPid(),
            "tipo",      PID_TYPE.getOrDefault(t.getPid(), "Anomalia"),
            "valor",     round1(t.getValue()),
            "unidade",   t.getUnit() != null ? t.getUnit() : "",
            "nivel",     determineNivel(t.getPid(), t.getValue()),
            "timestamp", t.getTimestamp() != null ? t.getTimestamp().toString() : ""
        )).collect(Collectors.toList());
    }

    // ── Relatórios ────────────────────────────────────────────────────────────

    public Map<String, Object> getRelatorios() {
        Map<String, Long>   byVehicle   = toLongMap(repository.countByVehicle());
        Map<String, Long>   speedAlerts = toLongMap(repository.countSpeedAlerts());
        Map<String, Long>   tempAlerts  = toLongMap(repository.countTempAlerts());
        Map<String, Double> avgSpeed    = toDoubleMap(repository.avgByVehicleAndPid("0x0D"));
        Map<String, Double> sumSpeed    = toDoubleMap(repository.sumSpeedByVehicle());

        List<Map<String, Object>> porVeiculo = new ArrayList<>();
        for (String[] v : FLEET) {
            String id = v[0];
            double km = sumSpeed.getOrDefault(id, 0.0) / 3600.0;
            porVeiculo.add(mapOf(
                "id",                   id,
                "nome",                 v[1],
                "totalLeituras",        byVehicle.getOrDefault(id, 0L),
                "velMedia",             round1(avgSpeed.getOrDefault(id, 0.0)),
                "kmRodados",            round1(km),
                "alertasVelocidade",    speedAlerts.getOrDefault(id, 0L),
                "alertasTemperatura",   tempAlerts.getOrDefault(id, 0L)
            ));
        }

        return Map.of(
            "totalLeituras", repository.count(),
            "totalDanger",   repository.countDangerEvents(),
            "totalWarning",  repository.countWarningEvents(),
            "porVeiculo",    porVeiculo
        );
    }

    // ── Configurações ─────────────────────────────────────────────────────────

    public Map<String, Object> getConfiguracoes() {
        return Map.of(
            "thresholds", Map.of(
                "velocidade",   Map.of("warning", 80,   "danger", 100,  "unit", "km/h"),
                "temperatura",  Map.of("warning", 90,   "danger", 100,  "unit", "°C"),
                "rpm",          Map.of("warning", 5000, "danger", 6000, "unit", "rpm"),
                "lambda",       Map.of("min", 12.0, "max", 16.0, "stoic", 14.7, "unit", "A/F")
            ),
            "frota", Map.of(
                "veiculos",          FLEET.length,
                "consumo_l100km",    9.0,
                "preco_litro_brl",   6.00,
                "intervalo_leitura_s", 1
            ),
            "mqtt", Map.of(
                "broker", "localhost:1883",
                "topico", "zerith/vehicles/+/telemetry",
                "qos",    0
            )
        );
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Map<String, Long> toLongMap(List<Object[]> rows) {
        return rows.stream().filter(r -> r[0] != null).collect(
            Collectors.toMap(r -> (String) r[0], r -> ((Number) r[1]).longValue())
        );
    }

    private Map<String, Double> toDoubleMap(List<Object[]> rows) {
        return rows.stream().filter(r -> r[0] != null).collect(
            Collectors.toMap(r -> (String) r[0], r -> r[1] != null ? ((Number) r[1]).doubleValue() : 0.0)
        );
    }

    private int calcScore(long anomalies) {
        return (int) Math.max(20, 100 - Math.min(anomalies * 3L, 80L));
    }

    private String levelFromCount(long count) {
        if (count > 10) return "danger";
        if (count > 3)  return "warning";
        return "ok";
    }

    private String determineNivel(String pid, double value) {
        return switch (pid) {
            case "0x0D" -> value > 100 ? "danger" : "warning";
            case "0x05" -> value > 100 ? "danger" : "warning";
            case "0x0C" -> value > 6000 ? "danger" : "warning";
            default     -> "warning";
        };
    }

    private void addIfNonZero(List<Map<String, Object>> list, String id, String nome, String tipo, Map<String, Long> alerts) {
        long count = alerts.getOrDefault(id, 0L);
        if (count == 0) return;
        list.add(mapOf(
            "vehicleId",   id,
            "veiculo",     nome,
            "tipo",        tipo,
            "ocorrencias", count,
            "prioridade",  levelFromCount(count)
        ));
    }

    private double round1(double v) { return Math.round(v * 10.0) / 10.0; }
    private double round2(double v) { return Math.round(v * 100.0) / 100.0; }

    @SafeVarargs
    private static Map<String, Object> mapOf(Object... kv) {
        Map<String, Object> m = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) m.put((String) kv[i], kv[i + 1]);
        return m;
    }
}
