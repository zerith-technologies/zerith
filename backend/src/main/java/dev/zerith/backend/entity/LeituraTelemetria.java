package dev.zerith.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "leituras_telemetria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeituraTelemetria {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "veiculo_id", nullable = false)
    private Veiculo veiculo;

    @NotNull
    @Column(name = "timestamp_leitura", nullable = false)
    private LocalDateTime timestampLeitura;

    @Column(name = "velocidade_kmh", precision = 5, scale = 2)
    private BigDecimal velocidadeKmh;

    @Column
    private Integer rpm;

    @Column(name = "temperatura_motor_c", precision = 5, scale = 2)
    private BigDecimal temperaturaMotorC;

    @Column(name = "nivel_combustivel_pct", precision = 5, scale = 2)
    private BigDecimal nivelCombustivelPct;

    @Column(name = "tensao_bateria_v", precision = 5, scale = 2)
    private BigDecimal tensaoBateriaV;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status_motor", nullable = false, length = 20)
    private StatusMotor statusMotor;

    @Column(name = "codigo_dtc", length = 20)
    private String codigoDtc;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "criado_em", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime criadoEm = LocalDateTime.now();

    public enum StatusMotor {
        LIGADO,
        DESLIGADO,
        FALHA
    }
}