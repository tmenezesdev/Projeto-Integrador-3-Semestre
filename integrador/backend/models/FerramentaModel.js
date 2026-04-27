import { getConnection } from '../config/database.js';

class FerramentaModel {

  static async listarTodos() {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM ferramentas ORDER BY id DESC'
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  static async buscarPorId(id) {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM ferramentas WHERE id = ?', [id]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  static async criar(dados) {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO ferramentas (nome, tag_rfid, peso_referencia, status) VALUES (?, ?, ?, ?)',
        [dados.nome, dados.tag_rfid, dados.peso_referencia ?? null, dados.status ?? 'DISPONIVEL']
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  static async atualizar(id, dados) {
    const connection = await getConnection();
    try {
      const campos = Object.keys(dados).map(k => `${k} = ?`).join(', ');
      const valores = [...Object.values(dados), id];
      const [result] = await connection.execute(
        `UPDATE ferramentas SET ${campos} WHERE id = ?`, valores
      );
      return result.affectedRows;
    } finally {
      connection.release();
    }
  }

  static async excluir(id) {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        'DELETE FROM ferramentas WHERE id = ?', [id]
      );
      return result.affectedRows;
    } finally {
      connection.release();
    }
  }

  static async buscarPorTagRfid(tag_rfid) {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM ferramentas WHERE tag_rfid = ?', [tag_rfid]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }
}

export default FerramentaModel;
