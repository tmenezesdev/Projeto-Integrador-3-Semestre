-- Cria o banco novo
CREATE DATABASE smartbench;
USE smartbench;

-- Tabela de Usuários (AGORA COM EMAIL)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL, 
    tag_cracha VARCHAR(50) UNIQUE NOT NULL, 
    tipo_perfil ENUM('ADMIN', 'SUPERVISOR', 'MECANICO') NOT NULL,
    senha VARCHAR(255) NOT NULL, 
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Ferramentas
CREATE TABLE IF NOT EXISTS ferramentas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tag_rfid VARCHAR(50) UNIQUE NOT NULL, 
    peso_referencia DECIMAL(10, 2), 
    status ENUM('DISPONIVEL', 'EM_USO', 'MANUTENCAO') DEFAULT 'DISPONIVEL',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Transações (Log de Eventos)
CREATE TABLE IF NOT EXISTS transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    ferramenta_id INT NOT NULL,
    tipo ENUM('RETIRADA', 'DEVOLUCAO') NOT NULL,
    metodo ENUM('RFID_AUTOMATICO', 'MANUAL') DEFAULT 'RFID_AUTOMATICO',
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (ferramenta_id) REFERENCES ferramentas(id) ON DELETE RESTRICT
);

-- Tabela de Reservas
CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    ferramenta_id INT NOT NULL,
    data_prevista DATETIME NOT NULL,
    status_reserva ENUM('PENDENTE', 'CONCLUIDA', 'ATRASADA') DEFAULT 'PENDENTE',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (ferramenta_id) REFERENCES ferramentas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rota VARCHAR(255) NOT NULL,
    metodo VARCHAR(10) NOT NULL,
    ip_address VARCHAR(50),
    user_agent VARCHAR(255),
    dados_requisicao TEXT,
    status_code INT,
    tempo_resposta_ms INT,
    dados_resposta TEXT,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Alertas
CREATE TABLE IF NOT EXISTS alertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ferramenta_id INT NOT NULL,
    mensagem TEXT NOT NULL,
    status_alerta ENUM('ATIVO', 'RESOLVIDO') DEFAULT 'ATIVO',
    data_geracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ferramenta_id) REFERENCES ferramentas(id) ON DELETE CASCADE
);

-- Tabela de Configurações
CREATE TABLE IF NOT EXISTS configuracoes_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tempo_limite_horas INT DEFAULT 4,
    tempo_aviso_minutos INT DEFAULT 30,
    modo_manutencao BOOLEAN DEFAULT FALSE,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserindo a configuração inicial
INSERT INTO configuracoes_sistema (tempo_limite_horas, tempo_aviso_minutos) VALUES (4, 30);

-- Trigger para atualizar o status da ferramenta automaticamente
DELIMITER //
CREATE TRIGGER trg_atualiza_status_ferramenta
AFTER INSERT ON transacoes
FOR EACH ROW
BEGIN
    IF NEW.tipo = 'RETIRADA' THEN
        UPDATE ferramentas SET status = 'EM_USO' WHERE id = NEW.ferramenta_id;
    ELSEIF NEW.tipo = 'DEVOLUCAO' THEN
        UPDATE ferramentas SET status = 'DISPONIVEL' WHERE id = NEW.ferramenta_id;
    END IF;
END;
//
DELIMITER ;

-- =========================================================================
-- PARTE 2: INSERÇÃO DOS DADOS (OS MÓVEIS)
-- =========================================================================

-- Inserindo Usuários (AGORA COM EMAIL | Senha de todos: 123456)
INSERT INTO usuarios (nome, email, tag_cracha, tipo_perfil, senha) VALUES
('Thiago Menezes Teixeira', 'thiago.menezes@gm.com', 'TAG-ADMIN-001', 'ADMIN', '$2a$10$4J57bTadHf6xQfJ9sBxh6.P6HvbFtJ03qtBooMkPfgrCIPbWnAnKO'),
('Juliana Oliveira', 'juliana.oliveira@gm.com', 'TAG-SUP-002', 'SUPERVISOR', '$2a$10$4J57bTadHf6xQfJ9sBxh6.P6HvbFtJ03qtBooMkPfgrCIPbWnAnKO'),
('Carlos Silva', 'carlos.silva@gm.com', 'TAG-MEC-003', 'MECANICO', '$2a$10$4J57bTadHf6xQfJ9sBxh6.P6HvbFtJ03qtBooMkPfgrCIPbWnAnKO'),
('Bávaro', 'bavaro@gm.com', 'TAG-MEC-004', 'MECANICO', '$2a$10$4J57bTadHf6xQfJ9sBxh6.P6HvbFtJ03qtBooMkPfgrCIPbWnAnKO'),
('Lucas Mendes', 'lucas.mendes@gm.com', 'TAG-MEC-005', 'MECANICO', '$2a$10$4J57bTadHf6xQfJ9sBxh6.P6HvbFtJ03qtBooMkPfgrCIPbWnAnKO');

-- Inserindo Ferramentas
INSERT INTO ferramentas (nome, tag_rfid, peso_referencia, status) VALUES
('Torquímetro Digital 200Nm', 'RFID-FER-001', 1.25, 'DISPONIVEL'),
('Alicate Amperímetro', 'RFID-FER-002', 0.45, 'DISPONIVEL'),
('Chave de Impacto Pneumática', 'RFID-FER-003', 2.10, 'DISPONIVEL'),
('Multímetro Digital Fluke', 'RFID-FER-004', 0.60, 'DISPONIVEL'),
('Paquímetro Analógico 150mm', 'RFID-FER-005', 0.30, 'DISPONIVEL'),
('Kit Chaves Torx (Jogo 9 peças)', 'RFID-FER-006', 0.85, 'DISPONIVEL'),
('Macaco Hidráulico Garrafa 2T', 'RFID-FER-007', 4.50, 'DISPONIVEL'),
('Lanterna de Inspeção LED', 'RFID-FER-008', 0.20, 'MANUTENCAO');

-- Inserindo Transações
INSERT INTO transacoes (usuario_id, ferramenta_id, tipo, metodo, data_hora) VALUES
(1, 4, 'RETIRADA', 'RFID_AUTOMATICO', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 4, 'DEVOLUCAO', 'RFID_AUTOMATICO', DATE_SUB(NOW(), INTERVAL 22 HOUR)),
(3, 2, 'RETIRADA', 'MANUAL', DATE_SUB(NOW(), INTERVAL 8 HOUR)),
(3, 2, 'DEVOLUCAO', 'MANUAL', DATE_SUB(NOW(), INTERVAL 7 HOUR)),
(4, 1, 'RETIRADA', 'RFID_AUTOMATICO', DATE_SUB(NOW(), INTERVAL 5 HOUR)), 
(3, 3, 'RETIRADA', 'RFID_AUTOMATICO', DATE_SUB(NOW(), INTERVAL 2 HOUR)), 
(2, 6, 'RETIRADA', 'MANUAL', DATE_SUB(NOW(), INTERVAL 30 MINUTE));

-- Inserindo Alertas
INSERT INTO alertas (ferramenta_id, mensagem, status_alerta) VALUES
(1, 'Ferramenta fora da bancada há mais de 4 horas. Limite de tempo excedido.', 'ATIVO'),
(8, 'Ferramenta enviada para calibração. Retorno previsto para amanhã.', 'ATIVO'),
(2, 'Aviso de calibração próxima: Faltam 5 dias úteis.', 'RESOLVIDO');

-- Inserindo Reservas
INSERT INTO reservas (usuario_id, ferramenta_id, data_prevista, status_reserva) VALUES
(4, 5, DATE_ADD(NOW(), INTERVAL 1 DAY), 'PENDENTE'), 
(5, 7, DATE_ADD(NOW(), INTERVAL 2 HOUR), 'PENDENTE'), 
(1, 4, DATE_SUB(NOW(), INTERVAL 2 DAY), 'CONCLUIDA');