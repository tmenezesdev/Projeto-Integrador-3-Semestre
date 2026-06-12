import mysql from 'mysql2/promise';
import dotenv from 'dotenv'; // ✅ Importa dotenv
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url); // ✅ Define __filename primeiro
const __dirname = path.dirname(__filename); // ✅ Depois define __dirname

dotenv.config({ path: path.resolve(__dirname, '../.env') }); // carrega backend/.env

const config = {
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
};

// ── CONFIRMAÇÃO DE SEGURANÇA ─────────────────────────────────────────────
function askConfirmation() {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log('\n');
        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║                    ⚠️  AVISO DE SEGURANÇA ⚠️                ║');
        console.log('╠════════════════════════════════════════════════════════════╣');
        console.log('║                                                            ║');
        console.log('║  Você está prestes a RESETAR TODOS OS DADOS do banco!      ║');
        console.log('║                                                            ║');
        console.log('║  ❌ TODAS as informações serão APAGADAS                    ║');
        console.log('║  ✅ Os dados de teste serão reinseridos                    ║');
        console.log('║  ⚠️  ESTA AÇÃO NÃO PODE SER DESFEITA!                     ║');
        console.log('║                                                            ║');
        console.log('╚════════════════════════════════════════════════════════════╝');
        console.log('\n');

        rl.question('Digite "RESETAR" para confirmar (ou "CANCELAR" para sair): ', (answer) => {
            rl.close();
            resolve(answer.toUpperCase());
        });
    });
}

async function run() {
    let db;
    try {
        // ── PEDIR CONFIRMAÇÃO ────────────────────────────────────────────
        const confirmacao = await askConfirmation();

        if (confirmacao !== 'RESETAR') {
            console.log('\n❌ Operação cancelada.\n');
            process.exit(0);
        }

        console.log('\n🚀 Iniciando reset do banco de dados...\n');

        db = await mysql.createConnection(config);
        console.log('✅ Conectado ao Railway MySQL\n');

        // ── LIMPAR DADOS ─────────────────────────────────────────────────────
        console.log('[ 1/2 ] Limpando dados existentes...');

        // Ordem importante (respeita foreign keys)
        const truncateTables = [
            'mensagens_chat',
            'alertas',
            'reservas',
            'transacoes',
            'ferramentas',
            'usuarios',
            'logs'
        ];

        for (const table of truncateTables) {
            try {
                await db.query(`TRUNCATE TABLE ${table}`);
                console.log(`  ✓ ${table} limpo`);
            } catch (error) {
                if (error.code === 'ER_NO_REFERENCED_TABLE') {
                    console.log(`  ⚠️  ${table} skipped (não existe)`);
                } else {
                    throw error;
                }
            }
        }

        console.log('\n✓ Todas as tabelas limpas\n');

        // ── REINSERT DADOS ───────────────────────────────────────────────────
        console.log('[ 2/2 ] Reinserindo dados de teste...\n');

        // USUÁRIOS
        await db.query(`
            INSERT INTO usuarios (nome, email, tag_cracha, tipo_perfil, senha) VALUES
            ('Thiago Menezes Teixeira', 'thiago.menezes@gm.com',  'TAG-ADMIN-001', 'ADMIN',      '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy'),
            ('Juliana Oliveira',        'juliana.oliveira@gm.com', 'TAG-SUP-002',  'SUPERVISOR', '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy'),
            ('Carlos Silva',            'carlos.silva@gm.com',     'TAG-MEC-003',  'MECANICO',   '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy'),
            ('Bávaro',                  'bavaro@gm.com',            'TAG-MEC-004',  'MECANICO',   '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy'),
            ('Lucas Mendes',            'lucas.mendes@gm.com',     'TAG-MEC-005',  'MECANICO',   '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy'),
            ('Marina Montagnini',       'marina.montagnini@gm.com','TAG-SUP-006',  'SUPERVISOR', '$2a$10$xJ/IC.9/GpqB84FzQMTBG.qWLKQd6Vl2L90rzgQuHnAh1PjsLDlNy')
        `);
        console.log('  ✓ Usuários inseridos');

        // FERRAMENTAS
        await db.query(`
            INSERT INTO ferramentas (nome, tag_rfid, peso_referencia, status) VALUES
            ('Torquímetro Digital 200Nm',     'RFID-FER-001', 1.25, 'DISPONIVEL'),
            ('Alicate Amperímetro',           'RFID-FER-002', 0.45, 'DISPONIVEL'),
            ('Chave de Impacto Pneumática',   'RFID-FER-003', 2.10, 'DISPONIVEL'),
            ('Multímetro Digital Fluke',      'RFID-FER-004', 0.60, 'DISPONIVEL'),
            ('Paquímetro Analógico 150mm',    'RFID-FER-005', 0.30, 'DISPONIVEL'),
            ('Kit Chaves Torx (Jogo 9 peças)','RFID-FER-006', 0.85, 'DISPONIVEL'),
            ('Macaco Hidráulico Garrafa 2T',  'RFID-FER-007', 4.50, 'DISPONIVEL'),
            ('Lanterna de Inspeção LED',      'RFID-FER-008', 0.20, 'MANUTENCAO')
        `);
        console.log('  ✓ Ferramentas inseridas');

        // TRANSAÇÕES
        await db.query(`
            INSERT INTO transacoes (usuario_id, ferramenta_id, tipo, metodo, observacao, data_hora) VALUES
            (1, 4, 'RETIRADA',  'RFID_AUTOMATICO', NULL,                                  DATE_SUB(NOW(), INTERVAL 1 DAY)),
            (1, 4, 'DEVOLUCAO', 'RFID_AUTOMATICO', NULL,                                  DATE_SUB(NOW(), INTERVAL 22 HOUR)),
            (3, 2, 'RETIRADA',  'MANUAL',          'Retirada autorizada pelo supervisor',  DATE_SUB(NOW(), INTERVAL 8 HOUR)),
            (3, 2, 'DEVOLUCAO', 'MANUAL',          'Devolvida em perfeito estado',         DATE_SUB(NOW(), INTERVAL 7 HOUR)),
            (4, 1, 'RETIRADA',  'RFID_AUTOMATICO', NULL,                                  DATE_SUB(NOW(), INTERVAL 5 HOUR)),
            (3, 3, 'RETIRADA',  'RFID_AUTOMATICO', NULL,                                  DATE_SUB(NOW(), INTERVAL 2 HOUR)),
            (2, 6, 'RETIRADA',  'MANUAL',          'Uso em inspeção de rotina',            DATE_SUB(NOW(), INTERVAL 30 MINUTE))
        `);
        console.log('  ✓ Transações inseridas');

        // ALERTAS
        await db.query(`
            INSERT INTO alertas (ferramenta_id, usuario_id, mensagem, status_alerta) VALUES
            (1, 4,    'Ferramenta fora da bancada há mais de 4 horas. Limite de tempo excedido.', 'ATIVO'),
            (8, NULL, 'Ferramenta enviada para calibração. Retorno previsto para amanhã.',        'ATIVO'),
            (2, NULL, 'Aviso de calibração próxima: Faltam 5 dias úteis.',                       'RESOLVIDO')
        `);
        console.log('  ✓ Alertas inseridos');

        // RESERVAS
        await db.query(`
            INSERT INTO reservas (usuario_id, ferramenta_id, data_prevista, status_reserva) VALUES
            (4, 5, DATE_ADD(NOW(), INTERVAL 1 DAY),  'PENDENTE'),
            (5, 7, DATE_ADD(NOW(), INTERVAL 2 HOUR), 'PENDENTE'),
            (1, 4, DATE_SUB(NOW(), INTERVAL 2 DAY),  'CONCLUIDA')
        `);
        console.log('  ✓ Reservas inseridas');

        await db.end();
        console.log('\n✅ Database resetado com sucesso!');
        console.log('   Todos os dados de teste foram reinseridos.\n');

    } catch (error) {
        console.error('\n❌ Erro:', error.message);
        if (db) await db.end();
        process.exit(1);
    }
}

run();
