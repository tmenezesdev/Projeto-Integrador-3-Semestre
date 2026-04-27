import { getConnection } from '../config/database.js';

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

  async listarFerramentas(req, res) {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(
        'SELECT id, nome, tag_rfid, status FROM ferramentas ORDER BY nome ASC'
      );
      res.json({ sucesso: true, dados: rows });
    } catch (error) {
      console.error('Erro em listarFerramentas:', error);
      res.status(500).json({ sucesso: false, erro: 'Erro ao buscar ferramentas.' });
    } finally {
      if (connection) connection.release();
    }
  }
}

export default new MecanicoController();
