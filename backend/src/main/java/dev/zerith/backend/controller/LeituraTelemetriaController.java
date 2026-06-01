package dev.zerith.backend.controller;

import dev.zerith.backend.dto.ApiResponse;
import dev.zerith.backend.dto.LeituraTelemetriaDTO;
import dev.zerith.backend.service.LeituraTelemetriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class LeituraTelemetriaController {

    private final LeituraTelemetriaService service;

    @PostMapping("/telemetria")
    public ResponseEntity<ApiResponse<LeituraTelemetriaDTO.Response>> registrar(
            @Valid @RequestBody LeituraTelemetriaDTO.CreateRequest req) {

        LeituraTelemetriaDTO.Response criada = service.registrar(req);
        log.debug("Leitura de telemetria registrada com sucesso para o veículo {}", req.getVeiculoId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Leitura de telemetria registrada com sucesso", criada));
    }

    @GetMapping("/veiculos/{id}/telemetria")
    public ResponseEntity<ApiResponse<Page<LeituraTelemetriaDTO.Response>>> listarPorVeiculo(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "20") int tamanho) {

        return ResponseEntity.ok(ApiResponse.ok(service.listarPorVeiculo(id, pagina, tamanho)));
    }

    @GetMapping("/veiculos/{id}/telemetria/ultima")
    public ResponseEntity<ApiResponse<LeituraTelemetriaDTO.Response>> buscarUltima(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(service.buscarUltima(id)));
    }

    @GetMapping("/veiculos/{id}/telemetria/recentes")
    public ResponseEntity<ApiResponse<List<LeituraTelemetriaDTO.Response>>> listarRecentes(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "30") int minutos) {

        return ResponseEntity.ok(ApiResponse.ok(service.listarRecentes(id, minutos)));
    }
}