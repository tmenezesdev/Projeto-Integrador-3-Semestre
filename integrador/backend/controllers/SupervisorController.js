import { getConnection, create, hashPassword } from '../config/database.js';

class SupervisorController {

  async listarFerramentasFora(req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `
        SELECT
          f.id,
          f.nome,
          f.tag_rfid AS tagRfid,
          u.nome AS responsavel,
          u.tipo_perfil AS cargo,
          DATE_FORMAT(t.data_hora, '%H:%i') AS horaRetirada,
          TIMESTAMPDIFF(MINUTE, t.data_hora, NOW()) AS minutosFora,
          IF(a.id IS NOT NULL AND a.status_alerta = 'ATIVO', 'ATRASADA', 'EM_USO') AS statusAlerta
        FROM ferramentas f
        JOIN transacoes t ON f.id = t.ferramenta_id
        JOIN usuarios u ON t.usuario_id = u.id
        LEFT JOIN alertas a ON f.id = a.ferramenta_id AND a.status_alerta = 'ATIVO'
        WHERE f.status = 'EM_USO'
          AND t.tipo = 'RETIRADA'
          AND t.id = (SELECT MAX(id) FROM transacoes WHERE ferramenta_id = f.id)
      `;
      const [rows] = await connection.execute(query);
      const resultado = rows.map(f => {
        const horas = Math.floor(f.minutosFora / 60);
        const mins = f.minutosFora % 60;
        return {
          ...f,
          tempoForaLabel: `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}h`
        };
      });
      res.json(resultado);
    } catch (error) {
      console.error('Erro em listarFerramentasFora:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar ferramentas fora.' });
    } finally {
      if (connection) connection.release();
    }
  }

  async listarHistorico(req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `
        SELECT
          t.id,
          f.nome AS ferramenta,
          f.tag_rfid AS tagRfid,
          u.nome AS responsavel,
          u.tipo_perfil AS cargo,
          t.tipo AS operacao,
          t.metodo,
          t.observacao,
          t.data_hora AS dataRaw,
          DATE_FORMAT(t.data_hora, '%d/%m/%Y %H:%i') AS dataHora
        FROM transacoes t
        JOIN ferramentas f ON t.ferramenta_id = f.id
        JOIN usuarios u ON t.usuario_id = u.id
        ORDER BY t.data_hora DESC
        LIMIT 200
      `;
      const [rows] = await connection.execute(query);
      res.json(rows);
    } catch (error) {
      console.error('Erro em listarHistorico:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar histórico.' });
    } finally {
      if (connection) connection.release();
    }
  }

  async listarAlertas(req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `
        SELECT
          a.id,
          a.mensagem,
          a.status_alerta,
          a.data_geracao,
          f.nome AS ferramenta,
          f.tag_rfid AS tagRfid,
          u.nome AS responsavel
        FROM alertas a
        JOIN ferramentas f ON a.ferramenta_id = f.id
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        ORDER BY a.data_geracao DESC
      `;
      const [rows] = await connection.execute(query);
      res.json(rows);
    } catch (error) {
      console.error('Erro em listarAlertas:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar alertas.' });
    } finally {
      if (connection) connection.release();
    }
  }

  async listarVisaoGeral(req, res) {
    let connection;
    try {
      connection = await getConnection();
      const [[{ totalFerramentas }]] = await connection.execute(
        'SELECT COUNT(*) AS totalFerramentas FROM ferramentas'
      );
      const [[{ transacoesHoje }]] = await connection.execute(
        'SELECT COUNT(*) AS transacoesHoje FROM transacoes WHERE DATE(data_hora) = CURDATE()'
      );
      const [[{ mecanicosAtivos }]] = await connection.execute(
        'SELECT COUNT(DISTINCT usuario_id) AS mecanicosAtivos FROM transacoes WHERE DATE(data_hora) = CURDATE()'
      );
      res.json({ totalFerramentas, transacoesHoje, mecanicosAtivos });
    } catch (error) {
      console.error('Erro em listarVisaoGeral:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar visão geral.' });
    } finally {
      if (connection) connection.release();
    }
  }

  async registrarDevolucaoManual(req, res) {
    const { ferramentaId, supervisorId, observacao } = req.body;
    if (!ferramentaId || !supervisorId) {
      return res.status(400).json({ sucesso: false, erro: 'ferramentaId e supervisorId são obrigatórios.' });
    }
    try {
      await create('transacoes', {
        usuario_id: supervisorId,
        ferramenta_id: ferramentaId,
        tipo: 'DEVOLUCAO',
        metodo: 'MANUAL',
        observacao: observacao || null
      });
      res.json({ sucesso: true, mensagem: 'Devolução registrada com sucesso.' });
    } catch (error) {
      console.error('Erro em registrarDevolucaoManual:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao processar devolução.' });
    }
  }

  async fluxoMovimentacoes(req, res) {
    const dias = parseInt(req.query.periodo) || 15;
    if (![7, 15, 90].includes(dias)) {
      return res.status(400).json({ sucesso: false, erro: 'Período inválido. Use 7, 15 ou 90.' });
    }
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT
          DATE(data_hora) AS dia,
          SUM(CASE WHEN tipo = 'RETIRADA'  THEN 1 ELSE 0 END) AS retiradas,
          SUM(CASE WHEN tipo = 'DEVOLUCAO' THEN 1 ELSE 0 END) AS devolucoes
        FROM transacoes
        WHERE data_hora >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY DATE(data_hora)
        ORDER BY dia ASC
      `, [dias]);

      const map = {};
      for (const r of rows) {
        const key = r.dia instanceof Date
          ? r.dia.toISOString().slice(0, 10)
          : String(r.dia).slice(0, 10);
        map[key] = r;
      }

      const result = [];
      for (let i = dias - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        result.push({
          data: label,
          retiradas:  Number(map[key]?.retiradas  ?? 0),
          devolucoes: Number(map[key]?.devolucoes ?? 0),
        });
      }
      res.json({ sucesso: true, dados: result });
    } catch (error) {
      console.error('Erro em fluxoMovimentacoes (supervisor):', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar fluxo.' });
    } finally {
      if (connection) connection.release();
    }
  }

  async criarFuncionario(req, res) {
    const { nome, email, tag_cracha, tipo_perfil } = req.body;

    if (!nome || !email || !tag_cracha) {
      return res.status(400).json({
        sucesso: false,
        erro: 'nome, email e tag_cracha são obrigatórios.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ sucesso: false, erro: 'Formato de email inválido.' });
    }

    const perfilValido = ['MECANICO', 'SUPERVISOR', 'ADMIN'];
    const perfil = tipo_perfil && perfilValido.includes(tipo_perfil.toUpperCase())
      ? tipo_perfil.toUpperCase()
      : 'MECANICO';

    let connection;
    try {
      connection = await getConnection();

      const [[emailExistente]] = await connection.execute(
        'SELECT id FROM usuarios WHERE email = ?', [email]
      );
      if (emailExistente) {
        return res.status(409).json({ sucesso: false, erro: 'Este e-mail já está cadastrado.' });
      }

      const [[crachExistente]] = await connection.execute(
        'SELECT id FROM usuarios WHERE tag_cracha = ?', [tag_cracha]
      );
      if (crachExistente) {
        return res.status(409).json({ sucesso: false, erro: 'Esta tag de crachá já está cadastrada.' });
      }

      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
      const senhaTemporaria = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      const senhaHash = await hashPassword(senhaTemporaria);

      const [result] = await connection.execute(
        'INSERT INTO usuarios (nome, email, tag_cracha, tipo_perfil, senha) VALUES (?, ?, ?, ?, ?)',
        [nome.trim(), email.trim().toLowerCase(), tag_cracha.trim().toUpperCase(), perfil, senhaHash]
      );

      res.status(201).json({
        sucesso: true,
        mensagem: 'Funcionário cadastrado com sucesso.',
        dados: {
          id: result.insertId,
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          tag_cracha: tag_cracha.trim().toUpperCase(),
          tipo_perfil: perfil,
          senhaTemporaria
        }
      });
    } catch (error) {
      console.error('Erro em criarFuncionario:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao cadastrar funcionário.' });
    } finally {
      if (connection) connection.release();
    }
  }
}

export default new SupervisorController();
