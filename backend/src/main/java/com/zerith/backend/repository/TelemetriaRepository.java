package com.zerith.backend.repository;

import com.zerith.backend.model.Telemetria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TelemetriaRepository extends JpaRepository<Telemetria, Long> {
    List<Telemetria> findByPid(String pid);
    List<Telemetria> findTop100ByPidOrderByTimestampDesc(String pid);
}
