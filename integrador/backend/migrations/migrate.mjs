import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = {
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
};

async function run() {
    if (!config.host || !config.user || !config.database) {
        throw new Error('Variáveis de banco ausentes. Configure o arquivo .env (veja env.example) antes de rodar a migration.');
    }

    const db = await mysql.createConnection(config);
    console.log(`Conectado ao MySQL (${config.host}) ✓`);

    // ── SCHEMA ──────────────────────────────────────────────────────────────
    console.log('\n[ 1/2 ] Criando tabelas...');

    const schema = `
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

        INSERT IGNORE INTO configuracoes_sistema (id, tempo_limite_horas, tempo_aviso_minutos)
        VALUES (1, 4, 30);
    `;

    await db.query(schema);
    console.log('Tabelas criadas ✓');

    // Adiciona colunas novas — ignora se já existirem (erro 1060)
    const alterações = [
        `ALTER TABLE configuracoes_sistema ADD COLUMN modo_manutencao BOOLEAN DEFAULT FALSE`,
        `ALTER TABLE configuracoes_sistema ADD COLUMN chat_ativo BOOLEAN DEFAULT TRUE`,
        `ALTER TABLE usuarios ADD COLUMN foto_url VARCHAR(255) NULL DEFAULT NULL`,
        `ALTER TABLE usuarios ADD COLUMN reset_token VARCHAR(255) NULL DEFAULT NULL`,
        `ALTER TABLE usuarios ADD COLUMN reset_token_expiry DATETIME NULL DEFAULT NULL`,
    ];
    for (const sql of alterações) {
        try {
            await db.query(sql);
        } catch (e) {
            if (e.errno === 1060) {
                // Coluna já existe — tudo certo
            } else {
                throw e;
            }
        }
    }
    console.log('Colunas novas adicionadas ✓');

    // ── TRIGGER ──────────────────────────────────────────────────────────────
    console.log('\nCriando trigger...');
    await db.query('DROP TRIGGER IF EXISTS trg_atualiza_status_ferramenta');
    await db.query(`
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
        END
    `);
    console.log('Trigger criada ✓');

    // ── SEED ─────────────────────────────────────────────────────────────────
    console.log('\n[ 2/2 ] Inserindo dados de teste...');

    const seed = `
        INSERT IGNORE INTO usuarios (nome, email, tag_cracha, tipo_perfil, senha) VALUES
        ('Thiago Menezes Teixeira', 'thiago.menezes@gm.com',  'TAG-ADMIN-001', 'ADMIN',      '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy'),
        ('Juliana Oliveira',        'juliana.oliveira@gm.com', 'TAG-SUP-002',  'SUPERVISOR', '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy'),
        ('Carlos Silva',            'carlos.silva@gm.com',     'TAG-MEC-003',  'MECANICO',   '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy'),
        ('Bávaro',                  'bavaro@gm.com',            'TAG-MEC-004',  'MECANICO',   '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy'),
        ('Lucas Mendes',            'lucas.mendes@gm.com',     'TAG-MEC-005',  'MECANICO',   '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy'),
        ('Marina Montagnini',       'marina.montagnini@gm.com','TAG-SUP-006',  'SUPERVISOR', '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy');

        INSERT IGNORE INTO ferramentas (nome, tag_rfid, peso_referencia, status) VALUES
        ('Torquímetro Digital 200Nm',     'RFID-FER-001', 1.25, 'DISPONIVEL'),
        ('Alicate Amperímetro',           'RFID-FER-002', 0.45, 'DISPONIVEL'),
        ('Chave de Impacto Pneumática',   'RFID-FER-003', 2.10, 'DISPONIVEL'),
        ('Multímetro Digital Fluke',      'RFID-FER-004', 0.60, 'DISPONIVEL'),
        ('Paquímetro Analógico 150mm',    'RFID-FER-005', 0.30, 'DISPONIVEL'),
        ('Kit Chaves Torx (Jogo 9 peças)','RFID-FER-006', 0.85, 'DISPONIVEL'),
        ('Macaco Hidráulico Garrafa 2T',  'RFID-FER-007', 4.50, 'DISPONIVEL'),
        ('Lanterna de Inspeção LED',      'RFID-FER-008', 0.20, 'MANUTENCAO');
    `;

    await db.query(seed);
    console.log('Usuários e ferramentas inseridos ✓');

    // Transações (dependem dos IDs gerados acima)
    await db.query(`
        INSERT IGNORE INTO transacoes (usuario_id, ferramenta_id, tipo, metodo, observacao, data_hora) VALUES
        (1, 4, 'RETIRADA',  'RFID_AUTOMATICO', NULL,                                  DATE_SUB(NOW(), INTERVAL 1 DAY)),
        (1, 4, 'DEVOLUCAO', 'RFID_AUTOMATICO', NULL,                                  DATE_SUB(NOW(), INTERVAL 22 HOUR)),
        (3, 2, 'RETIRADA',  'MANUAL',          'Retirada autorizada pelo supervisor',  DATE_SUB(NOW(), INTERVAL 8 HOUR)),
        (3, 2, 'DEVOLUCAO', 'MANUAL',          'Devolvida em perfeito estado',         DATE_SUB(NOW(), INTERVAL 7 HOUR)),
        (4, 1, 'RETIRADA',  'RFID_AUTOMATICO', NULL,                                  DATE_SUB(NOW(), INTERVAL 5 HOUR)),
        (3, 3, 'RETIRADA',  'RFID_AUTOMATICO', NULL,                                  DATE_SUB(NOW(), INTERVAL 2 HOUR)),
        (2, 6, 'RETIRADA',  'MANUAL',          'Uso em inspeção de rotina',            DATE_SUB(NOW(), INTERVAL 30 MINUTE))
    `);
    console.log('Transações inseridas ✓');

    await db.query(`
        INSERT IGNORE INTO alertas (ferramenta_id, usuario_id, mensagem, status_alerta) VALUES
        (1, 4,    'Ferramenta fora da bancada há mais de 4 horas. Limite de tempo excedido.', 'ATIVO'),
        (8, NULL, 'Ferramenta enviada para calibração. Retorno previsto para amanhã.',        'ATIVO'),
        (2, NULL, 'Aviso de calibração próxima: Faltam 5 dias úteis.',                       'RESOLVIDO')
    `);
    console.log('Alertas inseridos ✓');

    await db.query(`
        INSERT IGNORE INTO reservas (usuario_id, ferramenta_id, data_prevista, status_reserva) VALUES
        (4, 5, DATE_ADD(NOW(), INTERVAL 1 DAY),  'PENDENTE'),
        (5, 7, DATE_ADD(NOW(), INTERVAL 2 HOUR), 'PENDENTE'),
        (1, 4, DATE_SUB(NOW(), INTERVAL 2 DAY),  'CONCLUIDA')
    `);
    console.log('Reservas inseridas ✓');

    await db.end();
    console.log('\n✅ Migration concluída com sucesso!');
}

run().catch(err => {
    console.error('\n❌ Erro:', err.message);
    process.exit(1);
});
