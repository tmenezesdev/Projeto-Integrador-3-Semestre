import { getConnection, hashPassword } from '../config/database.js';
import UsuarioModel from '../models/UsuarioModel.js';
import FerramentaModel from '../models/FerramentaModel.js';

class AdminController {

  // ─── Dashboard ────────────────────────────────────────────────────────────

  static async dashboard(req, res) {
    let connection;
    try {
      connection = await getConnection();

      const [[{ totalFerramentas }]] = await connection.execute(
        'SELECT COUNT(*) AS totalFerramentas FROM ferramentas'
      );
      const [[{ totalUsuarios }]] = await connection.execute(
        'SELECT COUNT(*) AS totalUsuarios FROM usuarios'
      );
      const [[{ transacoesHoje }]] = await connection.execute(
        'SELECT COUNT(*) AS transacoesHoje FROM transacoes WHERE DATE(data_hora) = CURDATE()'
      );
      const [[{ alertasAtivos }]] = await connection.execute(
        "SELECT COUNT(*) AS alertasAtivos FROM alertas WHERE status_alerta = 'ATIVO'"
      );
      const [[{ ferramentasEmUso }]] = await connection.execute(
        "SELECT COUNT(*) AS ferramentasEmUso FROM ferramentas WHERE status = 'EM_USO'"
      );
      const [[{ ferramentasManutencao }]] = await connection.execute(
        "SELECT COUNT(*) AS ferramentasManutencao FROM ferramentas WHERE status = 'MANUTENCAO'"
      );
      const [[{ mecanicosAtivos }]] = await connection.execute(
        "SELECT COUNT(DISTINCT usuario_id) AS mecanicosAtivos FROM transacoes WHERE DATE(data_hora) = CURDATE()"
      );

      res.json({
        totalFerramentas,
        totalUsuarios,
        transacoesHoje,
        alertasAtivos,
        ferramentasEmUso,
        ferramentasManutencao,
        mecanicosAtivos
      });
    } catch (error) {
      console.error('Erro em AdminController.dashboard:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar dados do dashboard.' });
    } finally {
      if (connection) connection.release();
    }
  }

  // ─── Usuários ─────────────────────────────────────────────────────────────

  static async listarUsuarios(req, res) {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(
        'SELECT id, nome, email, tag_cracha, tipo_perfil, data_criacao FROM usuarios ORDER BY id DESC'
      );
      res.json({ sucesso: true, dados: rows });
    } catch (error) {
      console.error('Erro em AdminController.listarUsuarios:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao listar usuários.' });
    } finally {
      if (connection) connection.release();
    }
  }

  static async criarUsuario(req, res) {
    const { nome, email, tag_cracha, tipo_perfil, senha } = req.body;

    if (!nome || !email || !tag_cracha || !senha) {
      return res.status(400).json({ sucesso: false, erro: 'nome, email, tag_cracha e senha são obrigatórios.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ sucesso: false, erro: 'Formato de e-mail inválido.' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ sucesso: false, erro: 'Senha deve ter no mínimo 6 caracteres.' });
    }

    const perfilValido = ['ADMIN', 'SUPERVISOR', 'MECANICO'];
    const perfil = tipo_perfil && perfilValido.includes(tipo_perfil.toUpperCase())
      ? tipo_perfil.toUpperCase() : 'MECANICO';

    let connection;
    try {
      connection = await getConnection();

      const [[emailExiste]] = await connection.execute(
        'SELECT id FROM usuarios WHERE email = ?', [email.trim().toLowerCase()]
      );
      if (emailExiste) {
        return res.status(409).json({ sucesso: false, erro: 'Este e-mail já está cadastrado.' });
      }

      const [[crachExiste]] = await connection.execute(
        'SELECT id FROM usuarios WHERE tag_cracha = ?', [tag_cracha.trim().toUpperCase()]
      );
      if (crachExiste) {
        return res.status(409).json({ sucesso: false, erro: 'Esta tag de crachá já está cadastrada.' });
      }

      const senhaHash = await hashPassword(senha);
      const [result] = await connection.execute(
        'INSERT INTO usuarios (nome, email, tag_cracha, tipo_perfil, senha) VALUES (?, ?, ?, ?, ?)',
        [nome.trim(), email.trim().toLowerCase(), tag_cracha.trim().toUpperCase(), perfil, senhaHash]
      );

      res.status(201).json({
        sucesso: true,
        mensagem: 'Usuário criado com sucesso.',
        dados: { id: result.insertId, nome: nome.trim(), email: email.trim().toLowerCase(), tag_cracha: tag_cracha.trim().toUpperCase(), tipo_perfil: perfil }
      });
    } catch (error) {
      console.error('Erro em AdminController.criarUsuario:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao criar usuário.' });
    } finally {
      if (connection) connection.release();
    }
  }

  static async atualizarUsuario(req, res) {
    const { id } = req.params;
    const { nome, email, tag_cracha, tipo_perfil, senha } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ sucesso: false, erro: 'ID inválido.' });
    }

    let connection;
    try {
      connection = await getConnection();

      const [[existente]] = await connection.execute(
        'SELECT id FROM usuarios WHERE id = ?', [id]
      );
      if (!existente) {
        return res.status(404).json({ sucesso: false, erro: 'Usuário não encontrado.' });
      }

      const atualizacao = {};

      if (nome !== undefined) atualizacao.nome = nome.trim();

      if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ sucesso: false, erro: 'Formato de e-mail inválido.' });
        }
        const [[outro]] = await connection.execute(
          'SELECT id FROM usuarios WHERE email = ? AND id != ?', [email.trim().toLowerCase(), id]
        );
        if (outro) {
          return res.status(409).json({ sucesso: false, erro: 'E-mail já em uso por outro usuário.' });
        }
        atualizacao.email = email.trim().toLowerCase();
      }

      if (tag_cracha !== undefined) {
        const [[outro]] = await connection.execute(
          'SELECT id FROM usuarios WHERE tag_cracha = ? AND id != ?', [tag_cracha.trim().toUpperCase(), id]
        );
        if (outro) {
          return res.status(409).json({ sucesso: false, erro: 'Tag de crachá já em uso por outro usuário.' });
        }
        atualizacao.tag_cracha = tag_cracha.trim().toUpperCase();
      }

      if (tipo_perfil !== undefined) {
        const perfilValido = ['ADMIN', 'SUPERVISOR', 'MECANICO'];
        if (!perfilValido.includes(tipo_perfil.toUpperCase())) {
          return res.status(400).json({ sucesso: false, erro: 'Perfil inválido.' });
        }
        atualizacao.tipo_perfil = tipo_perfil.toUpperCase();
      }

      if (senha !== undefined) {
        if (senha.length < 6) {
          return res.status(400).json({ sucesso: false, erro: 'Senha deve ter no mínimo 6 caracteres.' });
        }
        atualizacao.senha = await hashPassword(senha);
      }

      if (Object.keys(atualizacao).length === 0) {
        return res.status(400).json({ sucesso: false, erro: 'Nenhum campo para atualizar.' });
      }

      await UsuarioModel.atualizar(id, atualizacao);
      res.json({ sucesso: true, mensagem: 'Usuário atualizado com sucesso.' });
    } catch (error) {
      console.error('Erro em AdminController.atualizarUsuario:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar usuário.' });
    } finally {
      if (connection) connection.release();
    }
  }

  static async excluirUsuario(req, res) {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ sucesso: false, erro: 'ID inválido.' });
    }

    if (parseInt(id) === req.usuario.id) {
      return res.status(400).json({ sucesso: false, erro: 'Você não pode excluir sua própria conta.' });
    }

    let connection;
    try {
      connection = await getConnection();

      const [[existente]] = await connection.execute(
        'SELECT id FROM usuarios WHERE id = ?', [id]
      );
      if (!existente) {
        return res.status(404).json({ sucesso: false, erro: 'Usuário não encontrado.' });
      }

      const [[temTransacao]] = await connection.execute(
        'SELECT id FROM transacoes WHERE usuario_id = ? LIMIT 1', [id]
      );
      if (temTransacao) {
        return res.status(409).json({
          sucesso: false,
          erro: 'Não é possível excluir: usuário possui transações registradas.'
        });
      }

      await connection.execute('DELETE FROM usuarios WHERE id = ?', [id]);
      res.json({ sucesso: true, mensagem: 'Usuário excluído com sucesso.' });
    } catch (error) {
      console.error('Erro em AdminController.excluirUsuario:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao excluir usuário.' });
    } finally {
      if (connection) connection.release();
    }
  }

  // ─── Ferramentas ──────────────────────────────────────────────────────────

  static async listarFerramentas(req, res) {
    try {
      const ferramentas = await FerramentaModel.listarTodos();
      res.json({ sucesso: true, dados: ferramentas });
    } catch (error) {
      console.error('Erro em AdminController.listarFerramentas:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao listar ferramentas.' });
    }
  }

  static async criarFerramenta(req, res) {
    const { nome, tag_rfid, peso_referencia, status } = req.body;

    if (!nome || !tag_rfid) {
      return res.status(400).json({ sucesso: false, erro: 'nome e tag_rfid são obrigatórios.' });
    }

    const statusValido = ['DISPONIVEL', 'EM_USO', 'MANUTENCAO'];
    if (status && !statusValido.includes(status)) {
      return res.status(400).json({ sucesso: false, erro: 'Status inválido.' });
    }

    try {
      const existente = await FerramentaModel.buscarPorTagRfid(tag_rfid.trim().toUpperCase());
      if (existente) {
        return res.status(409).json({ sucesso: false, erro: 'Esta tag RFID já está cadastrada.' });
      }

      const id = await FerramentaModel.criar({
        nome: nome.trim(),
        tag_rfid: tag_rfid.trim().toUpperCase(),
        peso_referencia: peso_referencia ? parseFloat(peso_referencia) : null,
        status: status ?? 'DISPONIVEL'
      });

      res.status(201).json({
        sucesso: true,
        mensagem: 'Ferramenta criada com sucesso.',
        dados: { id }
      });
    } catch (error) {
      console.error('Erro em AdminController.criarFerramenta:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao criar ferramenta.' });
    }
  }

  static async atualizarFerramenta(req, res) {
    const { id } = req.params;
    const { nome, tag_rfid, peso_referencia, status } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ sucesso: false, erro: 'ID inválido.' });
    }

    try {
      const existente = await FerramentaModel.buscarPorId(id);
      if (!existente) {
        return res.status(404).json({ sucesso: false, erro: 'Ferramenta não encontrada.' });
      }

      const atualizacao = {};
      if (nome !== undefined) atualizacao.nome = nome.trim();

      if (tag_rfid !== undefined) {
        const outra = await FerramentaModel.buscarPorTagRfid(tag_rfid.trim().toUpperCase());
        if (outra && outra.id !== parseInt(id)) {
          return res.status(409).json({ sucesso: false, erro: 'Esta tag RFID já está em uso por outra ferramenta.' });
        }
        atualizacao.tag_rfid = tag_rfid.trim().toUpperCase();
      }

      if (peso_referencia !== undefined) {
        atualizacao.peso_referencia = peso_referencia !== '' ? parseFloat(peso_referencia) : null;
      }

      if (status !== undefined) {
        const statusValido = ['DISPONIVEL', 'EM_USO', 'MANUTENCAO'];
        if (!statusValido.includes(status)) {
          return res.status(400).json({ sucesso: false, erro: 'Status inválido.' });
        }
        atualizacao.status = status;
      }

      if (Object.keys(atualizacao).length === 0) {
        return res.status(400).json({ sucesso: false, erro: 'Nenhum campo para atualizar.' });
      }

      await FerramentaModel.atualizar(id, atualizacao);
      res.json({ sucesso: true, mensagem: 'Ferramenta atualizada com sucesso.' });
    } catch (error) {
      console.error('Erro em AdminController.atualizarFerramenta:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar ferramenta.' });
    }
  }

  static async excluirFerramenta(req, res) {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ sucesso: false, erro: 'ID inválido.' });
    }

    let connection;
    try {
      connection = await getConnection();

      const existente = await FerramentaModel.buscarPorId(id);
      if (!existente) {
        return res.status(404).json({ sucesso: false, erro: 'Ferramenta não encontrada.' });
      }

      const [[temTransacao]] = await connection.execute(
        'SELECT id FROM transacoes WHERE ferramenta_id = ? LIMIT 1', [id]
      );
      if (temTransacao) {
        return res.status(409).json({
          sucesso: false,
          erro: 'Não é possível excluir: ferramenta possui transações registradas.'
        });
      }

      await FerramentaModel.excluir(id);
      res.json({ sucesso: true, mensagem: 'Ferramenta excluída com sucesso.' });
    } catch (error) {
      console.error('Erro em AdminController.excluirFerramenta:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao excluir ferramenta.' });
    } finally {
      if (connection) connection.release();
    }
  }

  // ─── Histórico ────────────────────────────────────────────────────────────

  static async listarHistorico(req, res) {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(`
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
        LIMIT 500
      `);
      res.json({ sucesso: true, dados: rows });
    } catch (error) {
      console.error('Erro em AdminController.listarHistorico:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar histórico.' });
    } finally {
      if (connection) connection.release();
    }
  }

  // ─── Alertas ──────────────────────────────────────────────────────────────

  static async listarAlertas(req, res) {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(`
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
      `);
      res.json({ sucesso: true, dados: rows });
    } catch (error) {
      console.error('Erro em AdminController.listarAlertas:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar alertas.' });
    } finally {
      if (connection) connection.release();
    }
  }

  static async resolverAlerta(req, res) {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ sucesso: false, erro: 'ID inválido.' });
    }

    let connection;
    try {
      connection = await getConnection();
      const [[alerta]] = await connection.execute(
        'SELECT id FROM alertas WHERE id = ?', [id]
      );
      if (!alerta) {
        return res.status(404).json({ sucesso: false, erro: 'Alerta não encontrado.' });
      }
      await connection.execute(
        "UPDATE alertas SET status_alerta = 'RESOLVIDO' WHERE id = ?", [id]
      );
      res.json({ sucesso: true, mensagem: 'Alerta marcado como resolvido.' });
    } catch (error) {
      console.error('Erro em AdminController.resolverAlerta:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao resolver alerta.' });
    } finally {
      if (connection) connection.release();
    }
  }

  // ─── Fluxo de Movimentações ───────────────────────────────────────────────

  static async fluxoMovimentacoes(req, res) {
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
      console.error('Erro em fluxoMovimentacoes:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar fluxo.' });
    } finally {
      if (connection) connection.release();
    }
  }

  // ─── Configurações ────────────────────────────────────────────────────────

  static async obterConfiguracoes(req, res) {
    let connection;
    try {
      connection = await getConnection();
      const [[config]] = await connection.execute(
        'SELECT * FROM configuracoes_sistema WHERE id = 1'
      );
      res.json({ sucesso: true, dados: config });
    } catch (error) {
      console.error('Erro em AdminController.obterConfiguracoes:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar configurações.' });
    } finally {
      if (connection) connection.release();
    }
  }

  static async atualizarConfiguracoes(req, res) {
    const { tempo_limite_horas, tempo_aviso_minutos, modo_manutencao } = req.body;

    const atualizacao = {};
    if (tempo_limite_horas !== undefined) {
      const val = parseInt(tempo_limite_horas);
      if (isNaN(val) || val < 1 || val > 24) {
        return res.status(400).json({ sucesso: false, erro: 'tempo_limite_horas deve ser entre 1 e 24.' });
      }
      atualizacao.tempo_limite_horas = val;
    }
    if (tempo_aviso_minutos !== undefined) {
      const val = parseInt(tempo_aviso_minutos);
      if (isNaN(val) || val < 1 || val > 120) {
        return res.status(400).json({ sucesso: false, erro: 'tempo_aviso_minutos deve ser entre 1 e 120.' });
      }
      atualizacao.tempo_aviso_minutos = val;
    }
    if (modo_manutencao !== undefined) {
      atualizacao.modo_manutencao = Boolean(modo_manutencao);
    }

    if (Object.keys(atualizacao).length === 0) {
      return res.status(400).json({ sucesso: false, erro: 'Nenhum campo para atualizar.' });
    }

    let connection;
    try {
      connection = await getConnection();
      const campos = Object.keys(atualizacao).map(k => `${k} = ?`).join(', ');
      await connection.execute(
        `UPDATE configuracoes_sistema SET ${campos} WHERE id = 1`,
        Object.values(atualizacao)
      );
      res.json({ sucesso: true, mensagem: 'Configurações atualizadas com sucesso.' });
    } catch (error) {
      console.error('Erro em AdminController.atualizarConfiguracoes:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar configurações.' });
    } finally {
      if (connection) connection.release();
    }
  }
}

export default AdminController;
