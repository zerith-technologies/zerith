package dev.zerith.backend;

import dev.zerith.backend.entity.Veiculo;
import dev.zerith.backend.repository.VeiculoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class VeiculoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private VeiculoRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    @DisplayName("POST /api/v1/veiculos — deve criar veículo com sucesso")
    void deveCriarVeiculo() throws Exception {
        String json = """
            {
                "placa": "ABC1D23",
                "apelido": "Van de Entrega",
                "marca": "Fiat",
                "modelo": "Ducato",
                "ano": 2022,
                "tipo": "VAN"
            }
            """;

        mockMvc.perform(post("/api/v1/veiculos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.placa").value("ABC1D23"))
                .andExpect(jsonPath("$.data.status").value("ATIVO"))
                .andExpect(jsonPath("$.data.id").isNotEmpty());
    }

    @Test
    @DisplayName("POST /api/v1/veiculos — deve rejeitar placa duplicada")
    void deveRejeitarPlacaDuplicada() throws Exception {
        String json = """
            {
                "placa": "XYZ9A99",
                "marca": "Honda",
                "modelo": "CG 160",
                "ano": 2021,
                "tipo": "MOTO"
            }
            """;

        mockMvc.perform(post("/api/v1/veiculos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated());

        // Segunda tentativa com a mesma placa
        mockMvc.perform(post("/api/v1/veiculos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("GET /api/v1/veiculos — deve listar veículos")
    void deveListarVeiculos() throws Exception {
        // Cria um veículo direto no banco
        repository.save(Veiculo.builder()
                .placa("TST1234")
                .marca("Toyota")
                .modelo("Corolla")
                .ano(2023)
                .tipo(Veiculo.TipoVeiculo.CARRO)
                .build());

        mockMvc.perform(get("/api/v1/veiculos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].placa").value("TST1234"));
    }

    @Test
    @DisplayName("GET /api/v1/veiculos/{id} — deve retornar 400 para ID inexistente")
    void deveRetornar400ParaIdInexistente() throws Exception {
        mockMvc.perform(get("/api/v1/veiculos/00000000-0000-0000-0000-000000000000"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
