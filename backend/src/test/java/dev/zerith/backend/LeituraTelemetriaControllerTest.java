package dev.zerith.backend;

import dev.zerith.backend.config.GlobalExceptionHandler;
import dev.zerith.backend.dto.LeituraTelemetriaDTO;
import dev.zerith.backend.entity.LeituraTelemetria;
import dev.zerith.backend.service.LeituraTelemetriaService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = dev.zerith.backend.controller.LeituraTelemetriaController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class LeituraTelemetriaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LeituraTelemetriaService service;

    @Test
    @DisplayName("POST /api/v1/telemetria — deve registrar leitura com sucesso")
    void deveRegistrarLeituraComSucesso() throws Exception {
        UUID veiculoId = UUID.randomUUID();

        when(service.registrar(any())).thenReturn(resposta(veiculoId, "ABC1D23", "Ducato"));

        mockMvc.perform(post("/api/v1/telemetria")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonLeitura(veiculoId)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.veiculo.placa").value("ABC1D23"))
                .andExpect(jsonPath("$.data.id").isNotEmpty());
    }

    @Test
    @DisplayName("POST /api/v1/telemetria — deve rejeitar leitura para veículo inexistente")
    void deveRejeitarLeituraParaVeiculoInexistente() throws Exception {
        UUID veiculoId = UUID.randomUUID();

        when(service.registrar(any())).thenThrow(new IllegalArgumentException("Veículo não encontrado: " + veiculoId));

        mockMvc.perform(post("/api/v1/telemetria")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonLeitura(veiculoId)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("GET /api/v1/veiculos/{id}/telemetria/ultima — deve retornar última leitura corretamente")
    void deveRetornarUltimaLeituraCorretamente() throws Exception {
        UUID veiculoId = UUID.randomUUID();

        when(service.buscarUltima(eq(veiculoId))).thenReturn(resposta(veiculoId, "XYZ9A99", "Corolla"));

        mockMvc.perform(get("/api/v1/veiculos/{id}/telemetria/ultima", veiculoId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.veiculo.placa").value("XYZ9A99"))
                .andExpect(jsonPath("$.data.veiculo.modelo").value("Corolla"));
    }

    @Test
    @DisplayName("GET /api/v1/veiculos/{id}/telemetria — deve retornar lista paginada")
    void deveRetornarListaPaginada() throws Exception {
        UUID veiculoId = UUID.randomUUID();

        LeituraTelemetriaDTO.Response leitura = resposta(veiculoId, "TST1234", "Transit");
        when(service.listarPorVeiculo(eq(veiculoId), anyInt(), anyInt()))
                .thenReturn(new PageImpl<>(List.of(leitura), PageRequest.of(0, 10), 1));

        mockMvc.perform(get("/api/v1/veiculos/{id}/telemetria", veiculoId)
                .param("pagina", "0")
                .param("tamanho", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content", org.hamcrest.Matchers.hasSize(1)))
                .andExpect(jsonPath("$.data.content[0].veiculo.modelo").value("Transit"));
    }

    private String jsonLeitura(UUID veiculoId) {
        return """
            {
                "veiculoId": "%s",
                "timestampLeitura": "2026-06-01T10:15:30",
                "velocidadeKmh": 72.40,
                "rpm": 1800,
                "temperaturaMotorC": 89.50,
                "nivelCombustivelPct": 64.20,
                "tensaoBateriaV": 12.60,
                "statusMotor": "LIGADO",
                "codigoDtc": "P0420",
                "latitude": -23.5505200,
                "longitude": -46.6333080
            }
            """.formatted(veiculoId);
    }

    private LeituraTelemetriaDTO.Response resposta(UUID veiculoId, String placa, String modelo) {
        return LeituraTelemetriaDTO.Response.builder()
                .id(UUID.randomUUID())
                .veiculoId(veiculoId)
                .timestampLeitura(LocalDateTime.of(2026, 6, 1, 10, 15, 30))
                .velocidadeKmh(new BigDecimal("72.40"))
                .rpm(1800)
                .temperaturaMotorC(new BigDecimal("89.50"))
                .nivelCombustivelPct(new BigDecimal("64.20"))
                .tensaoBateriaV(new BigDecimal("12.60"))
                .statusMotor(LeituraTelemetria.StatusMotor.LIGADO)
                .codigoDtc("P0420")
                .latitude(new BigDecimal("-23.5505200"))
                .longitude(new BigDecimal("-46.6333080"))
                .criadoEm(LocalDateTime.of(2026, 6, 1, 10, 15, 31))
                .veiculo(LeituraTelemetriaDTO.VeiculoResumo.builder()
                        .id(veiculoId)
                        .placa(placa)
                        .modelo(modelo)
                        .build())
                .build();
    }
}