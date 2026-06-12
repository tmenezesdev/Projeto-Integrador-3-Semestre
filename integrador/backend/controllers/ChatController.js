import { getConnection } from '../config/database.js';

const MAX_MENSAGEM = 1000;

const status = async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const [[cfg]] = await conn.execute(
            'SELECT chat_ativo FROM configuracoes_sistema WHERE id = 1'
        );
        res.json({ chat_ativo: cfg?.chat_ativo === 1 || cfg?.chat_ativo === true });
    } catch (error) {
        console.error('Erro em ChatController.status:', error);
        res.status(500).json({ erro: 'Erro ao verificar status do chat.' });
    } finally {
        if (conn) conn.release();
    }
};

const listar = async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const [msgs] = await conn.execute(
            `SELECT m.id, m.conteudo, m.criado_em, u.nome, u.tipo_perfil AS perfil, u.foto_url
             FROM mensagens_chat m
             JOIN usuarios u ON u.id = m.usuario_id
             ORDER BY m.criado_em DESC
             LIMIT 80`
        );
        res.json(msgs.reverse());
    } catch (error) {
        console.error('Erro em ChatController.listar:', error);
        res.status(500).json({ erro: 'Erro ao carregar mensagens.' });
    } finally {
        if (conn) conn.release();
    }
};

const enviar = async (req, res) => {
    const { conteudo } = req.body;
    if (!conteudo?.trim()) {
        return res.status(400).json({ erro: 'Mensagem não pode ser vazia' });
    }

    const texto = conteudo.trim();
    if (texto.length > MAX_MENSAGEM) {
        return res.status(400).json({ erro: `Mensagem muito longa (máximo ${MAX_MENSAGEM} caracteres).` });
    }

    let conn;
    try {
        conn = await getConnection();

        // Não permite enviar se o chat estiver desativado nas configurações
        const [[cfg]] = await conn.execute(
            'SELECT chat_ativo FROM configuracoes_sistema WHERE id = 1'
        );
        const ativo = cfg?.chat_ativo === 1 || cfg?.chat_ativo === true;
        if (!ativo) {
            return res.status(403).json({ erro: 'O chat está desativado no momento.' });
        }

        await conn.execute(
            'INSERT INTO mensagens_chat (usuario_id, conteudo) VALUES (?, ?)',
            [req.usuario.id, texto]
        );
        res.status(201).json({ sucesso: true });
    } catch (error) {
        console.error('Erro em ChatController.enviar:', error);
        res.status(500).json({ erro: 'Erro ao enviar mensagem.' });
    } finally {
        if (conn) conn.release();
    }
};

export default { status, listar, enviar };
