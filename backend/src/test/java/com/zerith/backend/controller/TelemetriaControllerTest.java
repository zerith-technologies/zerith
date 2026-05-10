package com.zerith.backend.controller;

import com.zerith.backend.model.Telemetria;
import com.zerith.backend.repository.TelemetriaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TelemetriaControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired TelemetriaRepository repository;

    @BeforeEach
    void limpar() {
        repository.deleteAll();
    }

    // --- Caso 1: JSON válido → 201 + persistido no banco ---

    @Test
    void postJsonValido_retorna201() throws Exception {
        String json = """
                {
                  "timestamp": "2026-05-09T02:14:00Z",
                  "pid": "0x0C",
                  "name": "rpm",
                  "value": 3200.0,
                  "unit": "rpm",
                  "raw_bytes": "03410c0c800000"
                }
                """;

        mockMvc.perform(post("/api/telemetry")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated());
    }

    @Test
    void postJsonValido_salvaNoBanco() throws Exception {
        String json = """
                {
                  "timestamp": "2026-05-09T02:14:00Z",
                  "pid": "0x0C",
                  "name": "rpm",
                  "value": 3200.0,
                  "unit": "rpm",
                  "raw_bytes": "03410c0c800000"
                }
                """;

        mockMvc.perform(post("/api/telemetry")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated());

        List<Telemetria> registros = repository.findByPid("0x0C");
        assertThat(registros).hasSize(1);
        assertThat(registros.get(0).getValue()).isEqualTo(3200.0);
        assertThat(registros.get(0).getUnit()).isEqualTo("rpm");
        assertThat(registros.get(0).getRawBytes()).isEqualTo("03410c0c800000");
    }

    // --- Caso 2: campo obrigatório ausente → 400 ---

    @Test
    void postSemCampoPid_retorna400() throws Exception {
        String json = """
                {
                  "timestamp": "2026-05-09T02:14:00Z",
                  "name": "rpm",
                  "value": 3200.0,
                  "unit": "rpm"
                }
                """;

        mockMvc.perform(post("/api/telemetry")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    void postSemCampoTimestamp_retorna400() throws Exception {
        String json = """
                {
                  "pid": "0x0C",
                  "name": "rpm",
                  "value": 3200.0,
                  "unit": "rpm"
                }
                """;

        mockMvc.perform(post("/api/telemetry")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    void postSemCampoValue_retorna400() throws Exception {
        String json = """
                {
                  "timestamp": "2026-05-09T02:14:00Z",
                  "pid": "0x0C",
                  "name": "rpm",
                  "unit": "rpm"
                }
                """;

        mockMvc.perform(post("/api/telemetry")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    // --- Caso 3: PID não suportado → 400 ---

    @Test
    void postPidNaoSuportado_retorna400() throws Exception {
        // 0xFF não está nos PIDs monitorados (0x05, 0x0B, 0x0C, 0x0D, 0x24)
        String json = """
                {
                  "timestamp": "2026-05-09T02:14:00Z",
                  "pid": "0xFF",
                  "name": "desconhecido",
                  "value": 0.0,
                  "unit": "?",
                  "raw_bytes": ""
                }
                """;

        mockMvc.perform(post("/api/telemetry")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    void postPidFormatoInvalido_retorna400() throws Exception {
        // PID no formato errado (não segue padrão 0xXX)
        String json = """
                {
                  "timestamp": "2026-05-09T02:14:00Z",
                  "pid": "INVALID",
                  "name": "rpm",
                  "value": 100.0,
                  "unit": "rpm"
                }
                """;

        mockMvc.perform(post("/api/telemetry")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }
}
