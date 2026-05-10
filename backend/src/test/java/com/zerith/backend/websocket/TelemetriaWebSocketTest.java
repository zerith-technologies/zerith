package com.zerith.backend.websocket;

import com.zerith.backend.repository.TelemetriaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.lang.reflect.Type;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class TelemetriaWebSocketTest {

    @LocalServerPort int port;
    @Autowired TestRestTemplate restTemplate;
    @Autowired TelemetriaRepository repository;

    private WebSocketStompClient stompClient;
    private final BlockingQueue<Map<String, Object>> fila = new LinkedBlockingQueue<>();

    @BeforeEach
    void configurar() {
        repository.deleteAll();
        fila.clear();
        stompClient = new WebSocketStompClient(new StandardWebSocketClient());
        stompClient.setMessageConverter(new MappingJackson2MessageConverter());
    }

    private StompSession conectarEAssinar() throws Exception {
        String wsUrl = "ws://localhost:" + port + "/ws";
        StompSession session = stompClient
                .connectAsync(wsUrl, new StompSessionHandlerAdapter() {})
                .get(5, TimeUnit.SECONDS);

        session.subscribe("/topic/telemetry", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return Map.class;
            }

            @Override
            @SuppressWarnings("unchecked")
            public void handleFrame(StompHeaders headers, Object payload) {
                fila.offer((Map<String, Object>) payload);
            }
        });

        return session;
    }

    private ResponseEntity<Void> enviarPost(String json) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return restTemplate.postForEntity(
                "/api/telemetry",
                new HttpEntity<>(json, headers),
                Void.class);
    }

    // --- Caso 1: POST bem-sucedido publica no tópico ---

    @Test
    void aposPostBemSucedido_publicaMensagemNoTopico() throws Exception {
        conectarEAssinar();

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

        ResponseEntity<Void> response = enviarPost(json);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        Map<String, Object> mensagem = fila.poll(5, TimeUnit.SECONDS);
        assertThat(mensagem).isNotNull();
        assertThat(mensagem.get("pid")).isEqualTo("0x0C");
    }

    // --- Caso 2: payload publicado é idêntico ao recebido ---

    @Test
    void payloadNoTopico_ehIdenticoAoPostado() throws Exception {
        conectarEAssinar();

        String json = """
                {
                  "timestamp": "2026-05-09T02:14:00Z",
                  "pid": "0x0B",
                  "name": "map_kpa",
                  "value": 127.0,
                  "unit": "kPa",
                  "raw_bytes": "03410b7f00000000"
                }
                """;

        enviarPost(json);

        Map<String, Object> mensagem = fila.poll(5, TimeUnit.SECONDS);
        assertThat(mensagem).isNotNull();
        assertThat(mensagem.get("pid")).isEqualTo("0x0B");
        assertThat(mensagem.get("name")).isEqualTo("map_kpa");
        assertThat(((Number) mensagem.get("value")).doubleValue()).isEqualTo(127.0);
        assertThat(mensagem.get("unit")).isEqualTo("kPa");
        assertThat(mensagem.get("raw_bytes")).isEqualTo("03410b7f00000000");
    }

    // --- Caso 3: POST inválido NÃO publica no tópico ---

    @Test
    void postInvalido_naoPublicaNoTopico() throws Exception {
        conectarEAssinar();

        // JSON sem campo obrigatório — deve retornar 400 e não publicar nada
        String jsonInvalido = """
                {
                  "pid": "0x0C",
                  "value": 100.0
                }
                """;

        ResponseEntity<Void> response = enviarPost(jsonInvalido);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);

        // Aguarda 2s: nenhuma mensagem deve chegar
        Map<String, Object> mensagem = fila.poll(2, TimeUnit.SECONDS);
        assertThat(mensagem).isNull();
    }
}
