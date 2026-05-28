import { getConnection } from '../config/database.js';

class TransacaoModel {
    static async registrar({ usuarioId, ferramentaId, tipo }) {
        const connection = await getConnection();
        try {
            const sql = `
        INSERT INTO transacoes (usuario_id, ferramenta_id, tipo, metodo) 
        VALUES (?, ?, ?, 'RFID_AUTOMATICO')
      `;
            const [result] = await connection.execute(sql, [usuarioId, ferramentaId, tipo]);
            return result.insertId;
        } catch (error) {
            console.error('Erro ao executar insert de transação:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default TransacaoModel;