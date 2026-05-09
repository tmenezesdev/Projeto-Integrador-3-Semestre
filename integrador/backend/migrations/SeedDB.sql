-- =========================================================================
-- SMARTBENCH — ARQUIVO 2: DADOS DE TESTE
-- Popula o banco com usuários, ferramentas e movimentações de exemplo
-- Execute este arquivo APÓS o 01_schema.sql
-- Senha padrão de todos os usuários: 123456
-- Hash gerado com bcryptjs (rounds: 10)
-- =========================================================================

USE SmartBench_DB;

-- -------------------------------------------------------------------------
-- USUÁRIOS
-- -------------------------------------------------------------------------

INSERT INTO usuarios (nome, email, tag_cracha, tipo_perfil, senha) VALUES
('Thiago Menezes Teixeira', 'thiago.menezes@gm.com',  'TAG-ADMIN-001', 'ADMIN',      '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy'),
('Juliana Oliveira',        'juliana.oliveira@gm.com', 'TAG-SUP-002',  'SUPERVISOR', '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy'),
('Carlos Silva',            'carlos.silva@gm.com',     'TAG-MEC-003',  'MECANICO',   '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy'),
('Bávaro',                  'bavaro@gm.com',            'TAG-MEC-004',  'MECANICO',   '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy'),
('Lucas Mendes',            'lucas.mendes@gm.com',     'TAG-MEC-005',  'MECANICO',   '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy'),
('Marina Montagnini',       'marina.montagnini@gm.com','TAG-SUP-006',  'SUPERVISOR', '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy');

-- -------------------------------------------------------------------------
-- FERRAMENTAS
-- -------------------------------------------------------------------------

INSERT INTO ferramentas (nome, tag_rfid, peso_referencia, status) VALUES
('Torquímetro Digital 200Nm',     'RFID-FER-001', 1.25, 'DISPONIVEL'),
('Alicate Amperímetro',           'RFID-FER-002', 0.45, 'DISPONIVEL'),
('Chave de Impacto Pneumática',   'RFID-FER-003', 2.10, 'DISPONIVEL'),
('Multímetro Digital Fluke',      'RFID-FER-004', 0.60, 'DISPONIVEL'),
('Paquímetro Analógico 150mm',    'RFID-FER-005', 0.30, 'DISPONIVEL'),
('Kit Chaves Torx (Jogo 9 peças)','RFID-FER-006', 0.85, 'DISPONIVEL'),
('Macaco Hidráulico Garrafa 2T',  'RFID-FER-007', 4.50, 'DISPONIVEL'),
('Lanterna de Inspeção LED',      'RFID-FER-008', 0.20, 'MANUTENCAO');

-- -------------------------------------------------------------------------
-- TRANSAÇÕES
-- -------------------------------------------------------------------------

INSERT INTO transacoes (usuario_id, ferramenta_id, tipo, metodo, observacao, data_hora) VALUES
(1, 4, 'RETIRADA',  'RFID_AUTOMATICO', NULL,                                   DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 4, 'DEVOLUCAO', 'RFID_AUTOMATICO', NULL,                                   DATE_SUB(NOW(), INTERVAL 22 HOUR)),
(3, 2, 'RETIRADA',  'MANUAL',          'Retirada autorizada pelo supervisor',   DATE_SUB(NOW(), INTERVAL 8 HOUR)),
(3, 2, 'DEVOLUCAO', 'MANUAL',          'Devolvida em perfeito estado',          DATE_SUB(NOW(), INTERVAL 7 HOUR)),
(4, 1, 'RETIRADA',  'RFID_AUTOMATICO', NULL,                                   DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(3, 3, 'RETIRADA',  'RFID_AUTOMATICO', NULL,                                   DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 6, 'RETIRADA',  'MANUAL',          'Uso em inspeção de rotina',             DATE_SUB(NOW(), INTERVAL 30 MINUTE));

-- -------------------------------------------------------------------------
-- ALERTAS
-- -------------------------------------------------------------------------

INSERT INTO alertas (ferramenta_id, usuario_id, mensagem, status_alerta) VALUES
(1, 4,    'Ferramenta fora da bancada há mais de 4 horas. Limite de tempo excedido.', 'ATIVO'),
(8, NULL, 'Ferramenta enviada para calibração. Retorno previsto para amanhã.',        'ATIVO'),
(2, NULL, 'Aviso de calibração próxima: Faltam 5 dias úteis.',                       'RESOLVIDO');

-- -------------------------------------------------------------------------
-- RESERVAS
-- -------------------------------------------------------------------------

INSERT INTO reservas (usuario_id, ferramenta_id, data_prevista, status_reserva) VALUES
(4, 5, DATE_ADD(NOW(), INTERVAL 1 DAY),  'PENDENTE'),
(5, 7, DATE_ADD(NOW(), INTERVAL 2 HOUR), 'PENDENTE'),
(1, 4, DATE_SUB(NOW(), INTERVAL 2 DAY),  'CONCLUIDA');
