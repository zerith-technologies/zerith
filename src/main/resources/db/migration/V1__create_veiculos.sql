-- ================================================================
-- V1__create_veiculos.sql
-- ZERITH — Tabela principal de veículos da frota
-- ================================================================

CREATE TABLE veiculos (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placa       VARCHAR(8)   NOT NULL UNIQUE,
    apelido     VARCHAR(100),
    marca       VARCHAR(50)  NOT NULL,
    modelo      VARCHAR(100) NOT NULL,
    ano         INTEGER      NOT NULL,
    tipo        VARCHAR(30)  NOT NULL,        -- CARRO, MOTO, VAN, CAMINHAO
    status      VARCHAR(20)  NOT NULL DEFAULT 'ATIVO',  -- ATIVO, INATIVO, MANUTENCAO
    odometro_km NUMERIC(10,2) NOT NULL DEFAULT 0,
    criado_em   TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP  NOT NULL DEFAULT NOW()
);

-- Index para buscas por status (listagem do dashboard)
CREATE INDEX idx_veiculos_status ON veiculos(status);

-- Index para busca por placa
CREATE INDEX idx_veiculos_placa ON veiculos(placa);

COMMENT ON TABLE veiculos IS 'Veículos cadastrados na frota ZERITH';
COMMENT ON COLUMN veiculos.placa IS 'Placa no formato Mercosul (ABC1D23) ou antigo (ABC1234)';
COMMENT ON COLUMN veiculos.status IS 'ATIVO = operacional | INATIVO = fora de uso | MANUTENCAO = em reparo';
