package com.zerith.backend.service;

import com.zerith.backend.dto.TelemetriaRequest;
import com.zerith.backend.model.Telemetria;
import com.zerith.backend.repository.TelemetriaRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class TelemetriaService {

    private final TelemetriaRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    public TelemetriaService(TelemetriaRepository repository, SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    public Telemetria salvar(TelemetriaRequest request) {
        Telemetria t = new Telemetria();
        t.setTimestamp(request.getTimestamp());
        t.setPid(request.getPid());
        t.setName(request.getName());
        t.setValue(request.getValue());
        t.setUnit(request.getUnit());
        t.setRawBytes(request.getRawBytes());
        Telemetria saved = repository.save(t);
        messagingTemplate.convertAndSend("/topic/telemetry", saved);
        return saved;
    }
}
