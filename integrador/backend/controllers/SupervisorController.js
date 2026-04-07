// src/controllers/SupervisorController.js
import { getConnection, create } from '../config/database.js';

class SupervisorController {
  async listarFerramentasFora(req, res) {
    let connection;
    try {
      connection = await getConnection(); // Usa a função correta do seu database.js

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

      const [rows] = await connection.execute(query); // No mysql2/promise usamos execute ou query

      const ferramentasFormatadas = rows.map(f => {
        const horas = Math.floor(f.minutosFora / 60);
        const mins = f.minutosFora % 60;
        return {
          ...f,
          tempoForaLabel: `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}h`
        };
      });

      res.json(ferramentasFormatadas);
    } catch (error) {
      console.error("Erro no SupervisorController (listarFerramentasFora):", error);
      res.status(500).json({ sucesso: false, erro: "Erro ao buscar ferramentas fora." });
    } finally {
      if (connection) connection.release(); // Sempre liberar a conexão!
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
          u.nome AS usuario,
          t.tipo,
          t.metodo,
          DATE_FORMAT(t.data_hora, '%d/%m/%Y %H:%i') AS dataHora
        FROM transacoes t
        JOIN ferramentas f ON t.ferramenta_id = f.id
        JOIN usuarios u ON t.usuario_id = u.id
        ORDER BY t.data_hora DESC
        LIMIT 100
      `;

      const [rows] = await connection.execute(query);
      res.json(rows);
    } catch (error) {
      console.error("Erro no SupervisorController (listarHistorico):", error);
      res.status(500).json({ sucesso: false, erro: "Erro ao buscar histórico." });
    } finally {
      if (connection) connection.release();
    }
  }

  async registrarDevolucaoManual(req, res) {
    const { ferramentaId, supervisorId } = req.body;
    try {
      // Aqui usamos a sua função create(table, data) original do database.js!
      await create('transacoes', {
        usuario_id: supervisorId,
        ferramenta_id: ferramentaId,
        tipo: 'DEVOLUCAO',
        metodo: 'MANUAL'
      });
      
      res.json({ sucesso: true, mensagem: "Devolução registrada com sucesso." });
    } catch (error) {
      console.error("Erro na devolução:", error);
      res.status(500).json({ sucesso: false, erro: "Erro ao processar devolução." });
    }
  }
}

export default new SupervisorController();