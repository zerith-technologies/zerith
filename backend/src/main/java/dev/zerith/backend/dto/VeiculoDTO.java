package dev.zerith.backend.dto;

import dev.zerith.backend.entity.Veiculo;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class VeiculoDTO {

    // ----------------------------------------------------------------
    // REQUEST — criar veículo
    // ----------------------------------------------------------------
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {

        @NotBlank(message = "Placa é obrigatória")
        @Pattern(
            regexp = "^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$",
            message = "Placa inválida"
        )
        private String placa;

        private String apelido;

        @NotBlank(message = "Marca é obrigatória")
        private String marca;

        @NotBlank(message = "Modelo é obrigatório")
        private String modelo;

        @NotNull(message = "Ano é obrigatório")
        @Min(1990) @Max(2030)
        private Integer ano;

        @NotNull(message = "Tipo é obrigatório")
        private Veiculo.TipoVeiculo tipo;
    }

    // ----------------------------------------------------------------
    // REQUEST — atualizar veículo
    // ----------------------------------------------------------------
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String apelido;
        private String marca;
        private String modelo;
        private Integer ano;
        private Veiculo.TipoVeiculo tipo;
        private Veiculo.StatusVeiculo status;

        @DecimalMin("0.0")
        private BigDecimal odometroKm;
    }

    // ----------------------------------------------------------------
    // RESPONSE — retorno padrão
    // ----------------------------------------------------------------
    @Getter
    @Builder
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private String placa;
        private String apelido;
        private String marca;
        private String modelo;
        private Integer ano;
        private Veiculo.TipoVeiculo tipo;
        private Veiculo.StatusVeiculo status;
        private BigDecimal odometroKm;
        private LocalDateTime criadoEm;
        private LocalDateTime atualizadoEm;

        public static Response from(Veiculo v) {
            return Response.builder()
                    .id(v.getId())
                    .placa(v.getPlaca())
                    .apelido(v.getApelido())
                    .marca(v.getMarca())
                    .modelo(v.getModelo())
                    .ano(v.getAno())
                    .tipo(v.getTipo())
                    .status(v.getStatus())
                    .odometroKm(v.getOdometroKm())
                    .criadoEm(v.getCriadoEm())
                    .atualizadoEm(v.getAtualizadoEm())
                    .build();
        }
    }
}
