package dev.zerith.backend.service;

import dev.zerith.backend.dto.LeituraTelemetriaDTO;
import dev.zerith.backend.entity.LeituraTelemetria;
import dev.zerith.backend.entity.Veiculo;
import dev.zerith.backend.repository.LeituraTelemetriaRepository;
import dev.zerith.backend.repository.VeiculoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeituraTelemetriaService {

    private final LeituraTelemetriaRepository repository;
    private final VeiculoRepository veiculoRepository;

    @Transactional
    public LeituraTelemetriaDTO.Response registrar(LeituraTelemetriaDTO.CreateRequest req) {
        Veiculo veiculo = buscarVeiculoOuFalhar(req.getVeiculoId());

        LeituraTelemetria leitura = LeituraTelemetria.builder()
                .veiculo(veiculo)
                .timestampLeitura(req.getTimestampLeitura())
                .velocidadeKmh(req.getVelocidadeKmh())
                .rpm(req.getRpm())
                .temperaturaMotorC(req.getTemperaturaMotorC())
                .nivelCombustivelPct(req.getNivelCombustivelPct())
                .tensaoBateriaV(req.getTensaoBateriaV())
                .statusMotor(req.getStatusMotor())
                .codigoDtc(req.getCodigoDtc())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .build();

        LeituraTelemetria salvo = repository.save(leitura);
        log.info("Leitura de telemetria registrada para o veículo {} em {}", veiculo.getPlaca(), salvo.getTimestampLeitura());
        return LeituraTelemetriaDTO.Response.from(salvo);
    }

    @Transactional(readOnly = true)
    public Page<LeituraTelemetriaDTO.Response> listarPorVeiculo(UUID veiculoId, int pagina, int tamanho) {
        buscarVeiculoOuFalhar(veiculoId);

        return repository.findByVeiculoIdOrderByTimestampLeituraDesc(veiculoId, PageRequest.of(Math.max(pagina, 0), Math.max(tamanho, 1)))
                .map(LeituraTelemetriaDTO.Response::from);
    }

    @Transactional(readOnly = true)
    public LeituraTelemetriaDTO.Response buscarUltima(UUID veiculoId) {
        buscarVeiculoOuFalhar(veiculoId);

        LeituraTelemetria leitura = repository.findUltimaLeitura(veiculoId)
                .orElseThrow(() -> new IllegalArgumentException("Nenhuma leitura de telemetria encontrada para o veículo: " + veiculoId));

        return LeituraTelemetriaDTO.Response.from(leitura);
    }

    @Transactional(readOnly = true)
    public List<LeituraTelemetriaDTO.Response> listarRecentes(UUID veiculoId, int minutos) {
        buscarVeiculoOuFalhar(veiculoId);

        LocalDateTime limite = LocalDateTime.now().minusMinutes(Math.max(minutos, 0));
        return repository.findByVeiculoIdAndTimestampLeituraAfter(veiculoId, limite)
                .stream()
                .sorted(Comparator.comparing(LeituraTelemetria::getTimestampLeitura).reversed())
                .map(LeituraTelemetriaDTO.Response::from)
                .toList();
    }

    private Veiculo buscarVeiculoOuFalhar(UUID veiculoId) {
        return veiculoRepository.findById(veiculoId)
                .orElseThrow(() -> new IllegalArgumentException("Veículo não encontrado: " + veiculoId));
    }
}