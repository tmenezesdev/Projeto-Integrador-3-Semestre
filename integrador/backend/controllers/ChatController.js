import { getConnection } from '../config/database.js';

const status = async (req, res) => {
    const conn = await getConnection();
    try {
        const [[cfg]] = await conn.execute(
            'SELECT chat_ativo FROM configuracoes_sistema WHERE id = 1'
        );
        res.json({ chat_ativo: cfg?.chat_ativo === 1 || cfg?.chat_ativo === true });
    } finally {
        conn.release();
    }
};

const listar = async (req, res) => {
    const conn = await getConnection();
    try {
        const [msgs] = await conn.execute(
            `SELECT m.id, m.conteudo, m.criado_em, u.nome, u.tipo_perfil AS perfil, u.foto_url
             FROM mensagens_chat m
             JOIN usuarios u ON u.id = m.usuario_id
             ORDER BY m.criado_em DESC
             LIMIT 80`
        );
        res.json(msgs.reverse());
    } finally {
        conn.release();
    }
};

const enviar = async (req, res) => {
    const { conteudo } = req.body;
    if (!conteudo?.trim()) {
        return res.status(400).json({ erro: 'Mensagem não pode ser vazia' });
    }
    const conn = await getConnection();
    try {
        await conn.execute(
            'INSERT INTO mensagens_chat (usuario_id, conteudo) VALUES (?, ?)',
            [req.usuario.id, conteudo.trim()]
        );
        res.status(201).json({ sucesso: true });
    } finally {
        conn.release();
    }
};

export default { status, listar, enviar };
