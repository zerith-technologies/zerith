package com.zerith.backend.controller;

import com.zerith.backend.dto.TelemetriaRequest;
import com.zerith.backend.service.TelemetriaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/telemetry")
public class TelemetriaController {

    private final TelemetriaService service;

    public TelemetriaController(TelemetriaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> receber(@Valid @RequestBody TelemetriaRequest request) {
        service.salvar(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
