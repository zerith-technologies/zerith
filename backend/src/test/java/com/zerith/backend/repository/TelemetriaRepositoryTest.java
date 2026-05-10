package com.zerith.backend.repository;

import com.zerith.backend.model.Telemetria;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class TelemetriaRepositoryTest {

    @Autowired TelemetriaRepository repository;

    private Telemetria novaLeitura(String pid, double valor, Instant ts) {
        Telemetria t = new Telemetria();
        t.setPid(pid);
        t.setName("sensor_" + pid);
        t.setValue(valor);
        t.setUnit("unit");
        t.setTimestamp(ts);
        t.setRawBytes("00");
        return t;
    }

    // --- Caso 1: salva e recupera por PID ---

    @Test
    void salvaLeitura_recuperaPorPid() {
        repository.save(novaLeitura("0x0C", 3500.0, Instant.now()));

        List<Telemetria> resultado = repository.findByPid("0x0C");

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getPid()).isEqualTo("0x0C");
        assertThat(resultado.get(0).getValue()).isEqualTo(3500.0);
    }

    @Test
    void findByPid_naoRetornaOutrosPids() {
        repository.save(novaLeitura("0x0C", 3500.0, Instant.now()));
        repository.save(novaLeitura("0x0D", 80.0, Instant.now()));

        List<Telemetria> resultado = repository.findByPid("0x0C");

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getPid()).isEqualTo("0x0C");
    }

    // --- Caso 2: top 100 por PID ordenado por timestamp DESC ---

    @Test
    void findTop100_retornaOrdenadoPorTimestampDesc() {
        Instant base = Instant.parse("2026-05-09T00:00:00Z");

        repository.save(novaLeitura("0x0D", 60.0, base.plusSeconds(10)));
        repository.save(novaLeitura("0x0D", 80.0, base.plusSeconds(20)));
        repository.save(novaLeitura("0x0D", 100.0, base.plusSeconds(30)));

        List<Telemetria> resultado = repository.findTop100ByPidOrderByTimestampDesc("0x0D");

        assertThat(resultado).hasSize(3);
        // mais recente primeiro
        assertThat(resultado.get(0).getValue()).isEqualTo(100.0);
        assertThat(resultado.get(1).getValue()).isEqualTo(80.0);
        assertThat(resultado.get(2).getValue()).isEqualTo(60.0);
    }

    @Test
    void findTop100_limita100RegistrosMesmoComMais() {
        Instant base = Instant.parse("2026-05-09T00:00:00Z");

        for (int i = 0; i < 150; i++) {
            repository.save(novaLeitura("0x05", (double) i, base.plusSeconds(i)));
        }

        List<Telemetria> resultado = repository.findTop100ByPidOrderByTimestampDesc("0x05");

        assertThat(resultado).hasSize(100);
    }

    @Test
    void findTop100_retornaOs100MaisRecentes() {
        Instant base = Instant.parse("2026-05-09T00:00:00Z");

        // salva 150: valores 0..149, timestamps crescentes
        for (int i = 0; i < 150; i++) {
            repository.save(novaLeitura("0x05", (double) i, base.plusSeconds(i)));
        }

        List<Telemetria> resultado = repository.findTop100ByPidOrderByTimestampDesc("0x05");

        // o mais recente deve ser o valor 149 (último salvo)
        assertThat(resultado.get(0).getValue()).isEqualTo(149.0);
        // o mais antigo do top-100 deve ser o valor 50
        assertThat(resultado.get(99).getValue()).isEqualTo(50.0);
    }
}
