package dev.zerith.backend.controller;

import dev.zerith.backend.dto.ApiResponse;
import dev.zerith.backend.dto.VeiculoDTO;
import dev.zerith.backend.entity.Veiculo;
import dev.zerith.backend.service.VeiculoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/veiculos")
@RequiredArgsConstructor
public class VeiculoController {

    private final VeiculoService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<VeiculoDTO.Response>>> listar(
            @RequestParam(required = false) Veiculo.StatusVeiculo status) {

        List<VeiculoDTO.Response> lista = (status != null)
                ? service.listarPorStatus(status)
                : service.listarTodos();

        return ResponseEntity.ok(ApiResponse.ok(lista));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VeiculoDTO.Response>> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(service.buscarPorId(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VeiculoDTO.Response>> criar(
            @Valid @RequestBody VeiculoDTO.CreateRequest req) {

        VeiculoDTO.Response criado = service.criar(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Veículo cadastrado com sucesso", criado));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<VeiculoDTO.Response>> atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody VeiculoDTO.UpdateRequest req) {

        return ResponseEntity.ok(ApiResponse.ok(service.atualizar(id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> remover(@PathVariable UUID id) {
        service.remover(id);
        return ResponseEntity.ok(ApiResponse.ok("Veículo removido", null));
    }
}
