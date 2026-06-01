package dev.zerith.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "veiculos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Placa é obrigatória")
    @Pattern(
        regexp = "^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$",
        message = "Placa inválida — use formato Mercosul (ABC1D23) ou antigo (ABC1234)"
    )
    @Column(nullable = false, unique = true, length = 8)
    private String placa;

    @Column(length = 100)
    private String apelido;

    @NotBlank(message = "Marca é obrigatória")
    @Column(nullable = false, length = 50)
    private String marca;

    @NotBlank(message = "Modelo é obrigatório")
    @Column(nullable = false, length = 100)
    private String modelo;

    @NotNull(message = "Ano é obrigatório")
    @Min(value = 1990, message = "Ano mínimo: 1990")
    @Max(value = 2030, message = "Ano inválido")
    @Column(nullable = false)
    private Integer ano;

    @NotNull(message = "Tipo é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TipoVeiculo tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private StatusVeiculo status = StatusVeiculo.ATIVO;

    @DecimalMin(value = "0.0", message = "Odômetro não pode ser negativo")
    @Column(name = "odometro_km", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal odometroKm = BigDecimal.ZERO;

    @Column(name = "criado_em", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime criadoEm = LocalDateTime.now();

    @UpdateTimestamp
    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    // ----------------------------------------------------------------
    // Enums de domínio
    // ----------------------------------------------------------------

    public enum TipoVeiculo {
        CARRO, MOTO, VAN, CAMINHAO
    }

    public enum StatusVeiculo {
        ATIVO, INATIVO, MANUTENCAO
    }
}
