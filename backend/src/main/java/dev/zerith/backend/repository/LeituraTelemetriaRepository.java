package dev.zerith.backend.repository;

import dev.zerith.backend.entity.LeituraTelemetria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LeituraTelemetriaRepository extends JpaRepository<LeituraTelemetria, UUID> {

    Page<LeituraTelemetria> findByVeiculoIdOrderByTimestampLeituraDesc(UUID veiculoId, Pageable pageable);

    List<LeituraTelemetria> findByVeiculoIdAndTimestampLeituraAfter(UUID veiculoId, LocalDateTime after);

    @Query(value = """
            select *
            from leituras_telemetria
            where veiculo_id = :veiculoId
            order by timestamp_leitura desc
            limit 1
            """, nativeQuery = true)
    Optional<LeituraTelemetria> findUltimaLeitura(@Param("veiculoId") UUID veiculoId);
}