-- =========================================================================
-- SMARTBENCH — ARQUIVO 1: ESTRUTURA
-- Cria o banco, todas as tabelas e a trigger
-- Execute este arquivo PRIMEIRO
-- =========================================================================

CREATE DATABASE IF NOT EXISTS SmartBench_DB;
USE SmartBench_DB;

-- -------------------------------------------------------------------------
-- TABELAS
-- -------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS usuarios (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    nome         VARCHAR(100) NOT NULL,
    email        VARCHAR(100) UNIQUE NOT NULL,
    tag_cracha   VARCHAR(50)  UNIQUE NOT NULL,
    tipo_perfil  ENUM('ADMIN', 'SUPERVISOR', 'MECANICO') NOT NULL,
    senha        VARCHAR(255) NOT NULL,
    foto_url           VARCHAR(255) NULL DEFAULT NULL,
    reset_token        VARCHAR(255) NULL DEFAULT NULL,
    reset_token_expiry DATETIME     NULL DEFAULT NULL,
    data_criacao       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ferramentas (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    nome             VARCHAR(100) NOT NULL,
    tag_rfid         VARCHAR(50)  UNIQUE NOT NULL,
    peso_referencia  DECIMAL(10, 2),
    status           ENUM('DISPONIVEL', 'EM_USO', 'MANUTENCAO') DEFAULT 'DISPONIVEL',
    data_cadastro    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ON DELETE RESTRICT: preserva histórico mesmo se usuário/ferramenta for removido
CREATE TABLE IF NOT EXISTS transacoes (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id    INT NOT NULL,
    ferramenta_id INT NOT NULL,
    tipo          ENUM('RETIRADA', 'DEVOLUCAO') NOT NULL,
    metodo        ENUM('RFID_AUTOMATICO', 'MANUAL') DEFAULT 'RFID_AUTOMATICO',
    observacao    VARCHAR(255) NULL,
    data_hora     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (usuario_id),
    INDEX (ferramenta_id),
    FOREIGN KEY (usuario_id)    REFERENCES usuarios(id)    ON DELETE RESTRICT,
    FOREIGN KEY (ferramenta_id) REFERENCES ferramentas(id) ON DELETE RESTRICT
);

-- ON DELETE CASCADE: reservas pendentes não fazem sentido sem o usuário/ferramenta
CREATE TABLE IF NOT EXISTS reservas (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id     INT NOT NULL,
    ferramenta_id  INT NOT NULL,
    data_prevista  DATETIME NOT NULL,
    status_reserva ENUM('PENDENTE', 'CONCLUIDA', 'ATRASADA', 'CANCELADA') DEFAULT 'PENDENTE',
    data_criacao   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id)    REFERENCES usuarios(id)    ON DELETE CASCADE,
    FOREIGN KEY (ferramenta_id) REFERENCES ferramentas(id) ON DELETE CASCADE
);

-- usuario_id NULL: permite alertas gerados automaticamente pelo sistema (sem usuário)
CREATE TABLE IF NOT EXISTS alertas (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    ferramenta_id INT NOT NULL,
    usuario_id    INT NULL,
    mensagem      TEXT NOT NULL,
    status_alerta ENUM('ATIVO', 'RESOLVIDO') DEFAULT 'ATIVO',
    data_geracao  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ferramenta_id) REFERENCES ferramentas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id)    REFERENCES usuarios(id)    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS configuracoes_sistema (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    tempo_limite_horas   INT     DEFAULT 4,
    tempo_aviso_minutos  INT     DEFAULT 30,
    modo_manutencao      BOOLEAN DEFAULT FALSE,
    chat_ativo           BOOLEAN DEFAULT TRUE,
    ultima_atualizacao   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logs (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    nivel          VARCHAR(50) DEFAULT 'INFO',
    mensagem       TEXT NOT NULL,
    data_registro  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mensagens_chat (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT  NOT NULL,
    conteudo   TEXT NOT NULL,
    criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- -------------------------------------------------------------------------
-- CONFIGURAÇÃO INICIAL DO SISTEMA (registro obrigatório, não é dado de teste)
-- -------------------------------------------------------------------------

INSERT IGNORE INTO configuracoes_sistema (id, tempo_limite_horas, tempo_aviso_minutos, chat_ativo)
VALUES (1, 4, 30, TRUE);

-- -------------------------------------------------------------------------
-- TRIGGER: Atualiza status da ferramenta ao registrar transação
-- Ferramentas em MANUTENCAO não são alteradas automaticamente
-- NOTA: Execute via MySQL CLI ou MySQL Workbench (Run SQL Script)
-- -------------------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_atualiza_status_ferramenta;

DELIMITER //
CREATE TRIGGER trg_atualiza_status_ferramenta
AFTER INSERT ON transacoes
FOR EACH ROW
BEGIN
    IF NEW.tipo = 'RETIRADA' THEN
        UPDATE ferramentas SET status = 'EM_USO'
        WHERE id = NEW.ferramenta_id AND status != 'MANUTENCAO';
    ELSEIF NEW.tipo = 'DEVOLUCAO' THEN
        UPDATE ferramentas SET status = 'DISPONIVEL'
        WHERE id = NEW.ferramenta_id AND status != 'MANUTENCAO';
    END IF;
END //
DELIMITER ;
