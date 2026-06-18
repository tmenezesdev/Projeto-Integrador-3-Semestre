import { getConnection, comparePassword, hashPassword } from '../config/database.js';
import UsuarioModel from '../models/UsuarioModel.js';
import { removerArquivoAntigo } from '../middlewares/uploadMiddleware.js';

class MecanicoController {

  async minhasRetiradas(req, res) {
    const usuarioId = req.usuario.id;
    let connection;
    try {
      connection = await getConnection();
      const query = `
        SELECT
          f.id,
          f.nome AS ferramenta,
          f.tag_rfid AS tagRfid,
          DATE_FORMAT(t.data_hora, '%d/%m/%Y %H:%i') AS horaRetirada,
          TIMESTAMPDIFF(MINUTE, t.data_hora, NOW()) AS minutosFora,
          IF(a.id IS NOT NULL AND a.status_alerta = 'ATIVO', 'ATRASADA', 'EM_USO') AS statusAlerta
        FROM ferramentas f
        JOIN transacoes t ON f.id = t.ferramenta_id
        LEFT JOIN alertas a ON f.id = a.ferramenta_id AND a.status_alerta = 'ATIVO'
        WHERE f.status = 'EM_USO'
          AND t.usuario_id = ?
          AND t.tipo = 'RETIRADA'
          AND t.id = (SELECT MAX(id) FROM transacoes WHERE ferramenta_id = f.id)
        ORDER BY t.data_hora DESC
      `;
      const [rows] = await connection.execute(query, [usuarioId]);
      const resultado = rows.map(f => {
        const horas = Math.floor(f.minutosFora / 60);
        const mins = f.minutosFora % 60;
        return { ...f, tempoForaLabel: `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}h` };
      });
      res.json({ sucesso: true, dados: resultado });
    } catch (error) {
      console.error('Erro em minhasRetiradas:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar retiradas.' });
    } finally {
      if (connection) connection.release();
    }
  }

  async registrarDevolucao(req, res) {
    const usuarioId = req.usuario.id;
    const { ferramentaId, tagCracha } = req.body;

    if (!ferramentaId) {
      return res.status(400).json({ sucesso: false, erro: 'ferramentaId é obrigatório.' });
    }
    if (!tagCracha?.trim()) {
      return res.status(400).json({ sucesso: false, erro: 'Crachá é obrigatório.' });
    }

    let connection;
    try {
      connection = await getConnection();

      // Valida o crachá digitado contra o cadastro do mecânico logado
      const [[user]] = await connection.execute(
        'SELECT tag_cracha FROM usuarios WHERE id = ?', [usuarioId]
      );
      if (!user) return res.status(404).json({ sucesso: false, erro: 'Usuário não encontrado.' });
      if (user.tag_cracha?.trim().toUpperCase() !== tagCracha.trim().toUpperCase()) {
        return res.status(401).json({ sucesso: false, erro: 'Crachá não confere com o seu cadastro.' });
      }

      // Confirma que a ferramenta está EM_USO e é a retirada ativa deste mecânico
      const [[ferr]] = await connection.execute(
        `SELECT f.id FROM ferramentas f
         JOIN transacoes t ON f.id = t.ferramenta_id
         WHERE f.id = ? AND f.status = 'EM_USO' AND t.usuario_id = ? AND t.tipo = 'RETIRADA'
           AND t.id = (SELECT MAX(id) FROM transacoes WHERE ferramenta_id = f.id)`,
        [ferramentaId, usuarioId]
      );
      if (!ferr) {
        return res.status(400).json({ sucesso: false, erro: 'Esta ferramenta não está entre as suas retiradas ativas.' });
      }

      // Registra a devolução. A trigger trg_atualiza_status_ferramenta volta o status p/ DISPONIVEL
      await connection.execute(
        `INSERT INTO transacoes (usuario_id, ferramenta_id, tipo, metodo, observacao)
         VALUES (?, ?, 'DEVOLUCAO', 'MANUAL', 'Devolução via crachá (digitado)')`,
        [usuarioId, ferramentaId]
      );

      res.json({ sucesso: true, mensagem: 'Ferramenta devolvida com sucesso.' });
    } catch (error) {
      console.error('Erro em registrarDevolucao:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao registrar devolução.' });
    } finally {
      if (connection) connection.release();
    }
  }

  async meuHistorico(req, res) {
    const usuarioId = req.usuario.id;
    let connection;
    try {
      connection = await getConnection();
      const query = `
        SELECT
          t.id,
          f.nome AS ferramenta,
          f.tag_rfid AS tagRfid,
          t.tipo AS operacao,
          t.metodo,
          t.observacao,
          CASE WHEN t.tipo = 'RETIRADA' THEN
            TIMESTAMPDIFF(MINUTE, t.data_hora, (
              SELECT MIN(t2.data_hora) FROM transacoes t2
              WHERE t2.ferramenta_id = t.ferramenta_id
                AND t2.tipo = 'DEVOLUCAO'
                AND t2.data_hora > t.data_hora
            ))
          ELSE NULL END AS duracaoMinutos,
          DATE_FORMAT(t.data_hora, '%d/%m/%Y %H:%i') AS dataHora
        FROM transacoes t
        JOIN ferramentas f ON t.ferramenta_id = f.id
        WHERE t.usuario_id = ?
        ORDER BY t.data_hora DESC
        LIMIT 200
      `;
      const [rows] = await connection.execute(query, [usuarioId]);
      res.json({ sucesso: true, dados: rows });
    } catch (error) {
      console.error('Erro em meuHistorico:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar histórico.' });
    } finally {
      if (connection) connection.release();
    }
  }

  async meusAlertas(req, res) {
    const usuarioId = req.usuario.id;
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
          f.tag_rfid AS tagRfid
        FROM alertas a
        JOIN ferramentas f ON a.ferramenta_id = f.id
        WHERE a.usuario_id = ?
        ORDER BY a.data_geracao DESC
      `;
      const [rows] = await connection.execute(query, [usuarioId]);
      res.json({ sucesso: true, dados: rows });
    } catch (error) {
      console.error('Erro em meusAlertas:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar alertas.' });
    } finally {
      if (connection) connection.release();
    }
  }

  async obterPerfil(req, res) {
    try {
      const usuario = await UsuarioModel.buscarPorId(req.usuario.id);
      if (!usuario) return res.status(404).json({ sucesso: false, erro: 'Usuário não encontrado' });
      const { senha, ...dados } = usuario;
      res.json({ sucesso: true, dados });
    } catch (error) {
      console.error('Erro em obterPerfil:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar perfil.' });
    }
  }

  async atualizarPerfil(req, res) {
    const usuarioId = req.usuario.id;
    const { nome, email } = req.body;

    if (!nome?.trim()) return res.status(400).json({ sucesso: false, erro: 'Nome obrigatório.' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) return res.status(400).json({ sucesso: false, erro: 'E-mail inválido.' });

    try {
      const existente = await UsuarioModel.buscarPorEmail(email.trim().toLowerCase());
      if (existente && existente.id !== usuarioId) {
        return res.status(409).json({ sucesso: false, erro: 'E-mail já está em uso.' });
      }
      await UsuarioModel.atualizar(usuarioId, { nome: nome.trim(), email: email.trim().toLowerCase() });
      res.json({ sucesso: true, mensagem: 'Perfil atualizado com sucesso.' });
    } catch (error) {
      console.error('Erro em atualizarPerfil:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar perfil.' });
    }
  }

  async uploadFoto(req, res) {
    if (!req.file) return res.status(400).json({ sucesso: false, erro: 'Nenhuma imagem enviada.' });

    const usuarioId = req.usuario.id;
    const novaFotoUrl = req.file.path; // Cloudinary retorna a URL completa em req.file.path

    let connection;
    try {
      connection = await getConnection();

      const [rows] = await connection.execute('SELECT foto_url FROM usuarios WHERE id = ?', [usuarioId]);
      const fotoAntiga = rows[0]?.foto_url;
      if (fotoAntiga) await removerArquivoAntigo(fotoAntiga);

      await connection.execute('UPDATE usuarios SET foto_url = ? WHERE id = ?', [novaFotoUrl, usuarioId]);
      res.json({ sucesso: true, foto_url: novaFotoUrl });
    } catch (error) {
      console.error('Erro em uploadFoto:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao salvar foto.' });
    } finally {
      if (connection) connection.release();
    }
  }

  async alterarSenha(req, res) {
    const usuarioId = req.usuario.id;
    const { senha_atual, nova_senha } = req.body;

    if (!senha_atual || !nova_senha) return res.status(400).json({ sucesso: false, erro: 'Preencha todos os campos.' });
    if (nova_senha.length < 6) return res.status(400).json({ sucesso: false, erro: 'A nova senha deve ter ao menos 6 caracteres.' });

    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute('SELECT senha FROM usuarios WHERE id = ?', [usuarioId]);
      if (!rows.length) return res.status(404).json({ sucesso: false, erro: 'Usuário não encontrado.' });

      const senhaValida = await comparePassword(senha_atual, rows[0].senha);
      if (!senhaValida) return res.status(401).json({ sucesso: false, erro: 'Senha atual incorreta.' });

      const novoHash = await hashPassword(nova_senha);
      await connection.execute('UPDATE usuarios SET senha = ? WHERE id = ?', [novoHash, usuarioId]);
      res.json({ sucesso: true, mensagem: 'Senha alterada com sucesso.' });
    } catch (error) {
      console.error('Erro em alterarSenha:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao alterar senha.' });
    } finally {
      if (connection) connection.release();
    }
  }

  async obterStats(req, res) {
    const usuarioId = req.usuario.id;
    let connection;
    try {
      connection = await getConnection();
      const [[{ retiradas }]] = await connection.execute(
        `SELECT COUNT(*) AS retiradas FROM ferramentas f
         JOIN transacoes t ON f.id = t.ferramenta_id
         WHERE f.status = 'EM_USO' AND t.usuario_id = ? AND t.tipo = 'RETIRADA'
           AND t.id = (SELECT MAX(id) FROM transacoes WHERE ferramenta_id = f.id)`,
        [usuarioId]
      );
      const [[{ total }]] = await connection.execute(
        'SELECT COUNT(*) AS total FROM transacoes WHERE usuario_id = ?',
        [usuarioId]
      );
      const [[{ devolucoes }]] = await connection.execute(
        `SELECT COUNT(*) AS devolucoes FROM transacoes WHERE usuario_id = ? AND tipo = 'DEVOLUCAO'`,
        [usuarioId]
      );
      res.json({ sucesso: true, dados: { retiradas, total, devolucoes } });
    } catch (error) {
      console.error('Erro em obterStats:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar estatísticas.' });
    } finally {
      if (connection) connection.release();
    }
  }

  async listarFerramentas(req, res) {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT
          f.id,
          f.nome,
          f.tag_rfid,
          f.peso_referencia,
          f.status,
          u.nome        AS responsavel,
          u.tipo_perfil AS cargo,
          DATE_FORMAT(t.data_hora, '%d/%m/%Y %H:%i') AS horaRetirada,
          TIMESTAMPDIFF(MINUTE, t.data_hora, NOW())  AS minutosFora
        FROM ferramentas f
        LEFT JOIN transacoes t
          ON  f.status = 'EM_USO'
          AND t.ferramenta_id = f.id
          AND t.tipo = 'RETIRADA'
          AND t.id = (
            SELECT MAX(t2.id)
            FROM transacoes t2
            WHERE t2.ferramenta_id = f.id AND t2.tipo = 'RETIRADA'
          )
        LEFT JOIN usuarios u ON t.usuario_id = u.id
        ORDER BY f.nome ASC
      `);

      const resultado = rows.map(f => {
        if (f.minutosFora != null) {
          const h = Math.floor(f.minutosFora / 60);
          const m = f.minutosFora % 60;
          f.tempoForaLabel = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}h`;
        }
        return f;
      });

      res.json({ sucesso: true, dados: resultado });
    } catch (error) {
      console.error('Erro em listarFerramentas:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar ferramentas.' });
    } finally {
      if (connection) connection.release();
    }
  }
}

export default new MecanicoController();
