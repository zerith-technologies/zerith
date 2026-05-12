package com.zerith.backend.repository;

import com.zerith.backend.model.Telemetria;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TelemetriaRepository extends JpaRepository<Telemetria, Long> {

    List<Telemetria> findByPid(String pid);
    List<Telemetria> findTop100ByPidOrderByTimestampDesc(String pid);

    // ── Gestão queries ────────────────────────────────────────────────────────

    @Query("SELECT t.vehicleId, COUNT(t) FROM Telemetria t WHERE t.vehicleId IS NOT NULL GROUP BY t.vehicleId")
    List<Object[]> countByVehicle();

    @Query("SELECT t.vehicleId, AVG(t.value) FROM Telemetria t WHERE t.pid = :pid AND t.vehicleId IS NOT NULL GROUP BY t.vehicleId")
    List<Object[]> avgByVehicleAndPid(@Param("pid") String pid);

    @Query("SELECT t.vehicleId, MAX(t.value) FROM Telemetria t WHERE t.pid = :pid AND t.vehicleId IS NOT NULL GROUP BY t.vehicleId")
    List<Object[]> maxByVehicleAndPid(@Param("pid") String pid);

    @Query("SELECT t.vehicleId, SUM(t.value) FROM Telemetria t WHERE t.pid = '0x0D' AND t.vehicleId IS NOT NULL GROUP BY t.vehicleId")
    List<Object[]> sumSpeedByVehicle();

    @Query("SELECT t.vehicleId, COUNT(t) FROM Telemetria t WHERE t.pid = '0x0D' AND t.value > 100 AND t.vehicleId IS NOT NULL GROUP BY t.vehicleId")
    List<Object[]> countSpeedAlerts();

    @Query("SELECT t.vehicleId, COUNT(t) FROM Telemetria t WHERE t.pid = '0x05' AND t.value > 90 AND t.vehicleId IS NOT NULL GROUP BY t.vehicleId")
    List<Object[]> countTempAlerts();

    @Query("SELECT t.vehicleId, COUNT(t) FROM Telemetria t WHERE t.pid = '0x0C' AND t.value > 5000 AND t.vehicleId IS NOT NULL GROUP BY t.vehicleId")
    List<Object[]> countRpmAlerts();

    @Query("SELECT t.vehicleId, COUNT(t) FROM Telemetria t WHERE t.pid = '0x24' AND (t.value < 12.0 OR t.value > 16.0) AND t.vehicleId IS NOT NULL GROUP BY t.vehicleId")
    List<Object[]> countLambdaAlerts();

    @Query("SELECT COUNT(t) FROM Telemetria t WHERE t.vehicleId IS NOT NULL AND ((t.pid = '0x0D' AND t.value > 100) OR (t.pid = '0x05' AND t.value > 100) OR (t.pid = '0x0C' AND t.value > 6000))")
    long countDangerEvents();

    @Query("SELECT COUNT(t) FROM Telemetria t WHERE t.vehicleId IS NOT NULL AND ((t.pid = '0x0D' AND t.value > 80 AND t.value <= 100) OR (t.pid = '0x05' AND t.value > 90 AND t.value <= 100) OR (t.pid = '0x0C' AND t.value > 5000 AND t.value <= 6000) OR (t.pid = '0x24' AND (t.value < 12.0 OR t.value > 16.0)))")
    long countWarningEvents();

    @Query("SELECT t FROM Telemetria t WHERE t.vehicleId IS NOT NULL AND ((t.pid = '0x0D' AND t.value > 100) OR (t.pid = '0x05' AND t.value > 90) OR (t.pid = '0x0C' AND t.value > 5000) OR (t.pid = '0x24' AND (t.value < 12.0 OR t.value > 16.0))) ORDER BY t.timestamp DESC")
    List<Telemetria> findAllAnomalies(Pageable pageable);

    // Returns [vehicleId, pid, value] for the most recent reading of each PID per vehicle
    @Query("SELECT t.vehicleId, t.pid, t.value FROM Telemetria t WHERE t.vehicleId IS NOT NULL AND t.pid IN ('0x05', '0x0C', '0x0D', '0x24') AND t.timestamp = (SELECT MAX(t2.timestamp) FROM Telemetria t2 WHERE t2.vehicleId = t.vehicleId AND t2.pid = t.pid)")
    List<Object[]> latestValuePerVehiclePerPid();
}
