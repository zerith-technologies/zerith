package dev.zerith.backend.dto;

import dev.zerith.backend.entity.LeituraTelemetria;
import dev.zerith.backend.entity.Veiculo;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class LeituraTelemetriaDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {

        @NotNull(message = "Veículo é obrigatório")
        private UUID veiculoId;

        @NotNull(message = "Timestamp da leitura é obrigatório")
        private LocalDateTime timestampLeitura;

        @NotNull(message = "Velocidade é obrigatória")
        @Digits(integer = 3, fraction = 2)
        @DecimalMin(value = "0.0")
        private BigDecimal velocidadeKmh;

        @NotNull(message = "RPM é obrigatório")
        @Min(0)
        private Integer rpm;

        @NotNull(message = "Temperatura do motor é obrigatória")
        @Digits(integer = 3, fraction = 2)
        private BigDecimal temperaturaMotorC;

        @NotNull(message = "Nível de combustível é obrigatório")
        @Digits(integer = 3, fraction = 2)
        private BigDecimal nivelCombustivelPct;

        @NotNull(message = "Tensão da bateria é obrigatória")
        @Digits(integer = 3, fraction = 2)
        private BigDecimal tensaoBateriaV;

        @NotNull(message = "Status do motor é obrigatório")
        private LeituraTelemetria.StatusMotor statusMotor;

        private String codigoDtc;

        @NotNull(message = "Latitude é obrigatória")
        @Digits(integer = 3, fraction = 7)
        private BigDecimal latitude;

        @NotNull(message = "Longitude é obrigatória")
        @Digits(integer = 3, fraction = 7)
        private BigDecimal longitude;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID veiculoId;
        private LocalDateTime timestampLeitura;
        private BigDecimal velocidadeKmh;
        private Integer rpm;
        private BigDecimal temperaturaMotorC;
        private BigDecimal nivelCombustivelPct;
        private BigDecimal tensaoBateriaV;
        private LeituraTelemetria.StatusMotor statusMotor;
        private String codigoDtc;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private LocalDateTime criadoEm;
        private VeiculoResumo veiculo;

        public static Response from(LeituraTelemetria leitura) {
            Veiculo veiculo = leitura.getVeiculo();

            return Response.builder()
                    .id(leitura.getId())
                    .veiculoId(veiculo.getId())
                    .timestampLeitura(leitura.getTimestampLeitura())
                    .velocidadeKmh(leitura.getVelocidadeKmh())
                    .rpm(leitura.getRpm())
                    .temperaturaMotorC(leitura.getTemperaturaMotorC())
                    .nivelCombustivelPct(leitura.getNivelCombustivelPct())
                    .tensaoBateriaV(leitura.getTensaoBateriaV())
                    .statusMotor(leitura.getStatusMotor())
                    .codigoDtc(leitura.getCodigoDtc())
                    .latitude(leitura.getLatitude())
                    .longitude(leitura.getLongitude())
                    .criadoEm(leitura.getCriadoEm())
                    .veiculo(VeiculoResumo.from(veiculo))
                    .build();
        }
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class VeiculoResumo {
        private UUID id;
        private String placa;
        private String modelo;

        public static VeiculoResumo from(Veiculo veiculo) {
            return VeiculoResumo.builder()
                    .id(veiculo.getId())
                    .placa(veiculo.getPlaca())
                    .modelo(veiculo.getModelo())
                    .build();
        }
    }
}