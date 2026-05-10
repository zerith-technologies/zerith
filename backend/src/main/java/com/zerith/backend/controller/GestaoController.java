package com.zerith.backend.controller;

import com.zerith.backend.service.GestaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gestao")
@CrossOrigin(origins = "*")
public class GestaoController {

    private final GestaoService service;

    public GestaoController(GestaoService service) {
        this.service = service;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        return service.getDashboard();
    }

    @GetMapping("/motoristas")
    public List<Map<String, Object>> motoristas() {
        return service.getMotoristas();
    }

    @GetMapping("/veiculos")
    public List<Map<String, Object>> veiculos() {
        return service.getVeiculos();
    }

    @GetMapping("/financeiro")
    public Map<String, Object> financeiro() {
        return service.getFinanceiro();
    }

    @GetMapping("/manutencao")
    public List<Map<String, Object>> manutencao() {
        return service.getManutencao();
    }

    @GetMapping("/ocorrencias")
    public List<Map<String, Object>> ocorrencias() {
        return service.getOcorrencias();
    }

    @GetMapping("/relatorios")
    public Map<String, Object> relatorios() {
        return service.getRelatorios();
    }

    @GetMapping("/configuracoes")
    public Map<String, Object> configuracoes() {
        return service.getConfiguracoes();
    }
}
