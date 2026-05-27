import { getConnection } from '../config/database.js';

class TransacaoModel {
    static async registrar(usuario_id, ferramenta_id, tipo) {
        const connection = await getConnection();
        try {
            const [result] = await connection.execute(
                'INSERT INTO transacoes (usuario_id, ferramenta_id, tipo, metodo) VALUES (?, ?, ?, ?)',
                [usuario_id, ferramenta_id, tipo, 'RFID_AUTOMATICO']
            );
            return result.insertId;
        } catch (error) {
            console.error('Erro ao registrar transação:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default TransacaoModel;