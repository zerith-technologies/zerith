-- ================================================================
-- V2__create_leituras_telemetria.sql
-- ZERITH — Leituras de telemetria por veículo
-- ================================================================

CREATE TABLE leituras_telemetria (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    veiculo_id            UUID NOT NULL REFERENCES veiculos(id),
    timestamp_leitura     TIMESTAMP NOT NULL,
    velocidade_kmh        NUMERIC(5,2),
    rpm                   INTEGER,
    temperatura_motor_c   NUMERIC(5,2),
    nivel_combustivel_pct  NUMERIC(5,2),
    tensao_bateria_v      NUMERIC(5,2),
        status_motor          VARCHAR(20) NOT NULL,
    codigo_dtc            VARCHAR(20),
    latitude              NUMERIC(10,7),
    longitude             NUMERIC(10,7),
    criado_em             TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leituras_telemetria_veiculo_timestamp
    ON leituras_telemetria (veiculo_id, timestamp_leitura DESC);

COMMENT ON TABLE leituras_telemetria IS 'Leituras de telemetria recebidas dos veículos da frota ZERITH';
COMMENT ON COLUMN leituras_telemetria.status_motor IS 'LIGADO = motor ativo | DESLIGADO = motor inativo | FALHA = anomalia detectada';
COMMENT ON COLUMN leituras_telemetria.codigo_dtc IS 'Código de falha OBD-II, quando disponível';