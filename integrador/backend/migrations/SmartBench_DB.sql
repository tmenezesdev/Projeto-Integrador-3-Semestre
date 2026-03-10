-- 1. Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS smartbench;
USE smartbench;

-- 2. Tabela de Usuários
-- Armazena o Líder, Supervisor e Mecânicos
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tag_cracha VARCHAR(50) UNIQUE NOT NULL, -- Tag RFID do crachá do usuário
    tipo_perfil ENUM('ADMIN', 'SUPERVISOR', 'MECANICO') NOT NULL,
    senha VARCHAR(255) NOT NULL, -- Senha criptografada (hash)
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Ferramentas
-- Armazena o inventário físico da bancada
CREATE TABLE ferramentas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tag_rfid VARCHAR(50) UNIQUE NOT NULL, -- Tag colada/embutida na ferramenta
    peso_referencia DECIMAL(10, 2), -- Usado para o RF13 (Identificação por peso)
    status ENUM('DISPONIVEL', 'EM_USO', 'MANUTENCAO') DEFAULT 'DISPONIVEL',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Transações (Log de Eventos)
-- O "coração" da rastreabilidade: registra quem pegou o quê e quando
CREATE TABLE transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    ferramenta_id INT NOT NULL,
    tipo ENUM('RETIRADA', 'DEVOLUCAO') NOT NULL,
    metodo ENUM('RFID_AUTOMATICO', 'MANUAL') DEFAULT 'RFID_AUTOMATICO',
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (ferramenta_id) REFERENCES ferramentas(id) ON DELETE RESTRICT
);

-- 5. Tabela de Reservas
-- Permite que o mecânico reserve uma ferramenta via App antes do turno
CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    ferramenta_id INT NOT NULL,
    data_prevista DATETIME NOT NULL,
    status_reserva ENUM('PENDENTE', 'CONCLUIDA', 'ATRASADA') DEFAULT 'PENDENTE',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (ferramenta_id) REFERENCES ferramentas(id) ON DELETE CASCADE
);

-- 6. Tabela de Alertas
-- Registra avisos de ferramentas esquecidas ou tempo limite excedido
CREATE TABLE alertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ferramenta_id INT NOT NULL,
    mensagem TEXT NOT NULL,
    status_alerta ENUM('ATIVO', 'RESOLVIDO') DEFAULT 'ATIVO',
    data_geracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ferramenta_id) REFERENCES ferramentas(id) ON DELETE CASCADE
);

-- (Opcional) Trigger para atualizar o status da ferramenta automaticamente 
-- ao inserir uma nova transação
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
