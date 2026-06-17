import FerramentaModel from '../models/FerramentaModel.js';
import UsuarioModel from '../models/UsuarioModel.js';
import TransacaoModel from '../models/TransacaoModel.js';

let cartaoPendente = null;

export function setCartaoPendente(tag) {
  cartaoPendente = tag;
}

class RfidController {
  async receberTag(req, res) {
    try {
      const { rfidTag } = req.body;
      cartaoPendente = rfidTag;

      console.log("🟢 Backend recebeu o cartão da porta USB:", cartaoPendente);
      return res.status(200).json({ status: "Recebido com sucesso" });
    } catch (error) {
      console.error("Erro ao receber tag:", error);
      return res.status(500).json({ erro: "Erro ao processar tag RFID" });
    }
  }

  // Recebe uma movimentação (RETIRADA/DEVOLUCAO) enviada pelo agente serial
  // local. Lógica antes embutida na ponte-usb.js — agora roda na nuvem, com
  // acesso ao banco. A trigger trg_atualiza_status_ferramenta cuida do status.
  async receberEvento(req, res) {
    try {
      const { tag, cracha, tipo } = req.body || {};

      if (!tag || !cracha || !tipo) {
        return res.status(400).json({ erro: "Evento incompleto", recebido: { tag, cracha, tipo } });
      }

      const tipoNormalizado = String(tipo).toUpperCase();
      if (tipoNormalizado !== 'RETIRADA' && tipoNormalizado !== 'DEVOLUCAO') {
        return res.status(400).json({ erro: `Tipo de evento desconhecido: "${tipo}"` });
      }

      const ferramenta = await FerramentaModel.buscarPorTagRfid(tag);
      if (!ferramenta) {
        return res.status(404).json({ erro: `Ferramenta com tag "${tag}" não encontrada.` });
      }

      const usuario = await UsuarioModel.buscarPorCracha(cracha);
      if (!usuario) {
        return res.status(404).json({ erro: `Crachá não cadastrado: "${cracha}".` });
      }

      await TransacaoModel.registrar({
        usuarioId: usuario.id,
        ferramentaId: ferramenta.id,
        tipo: tipoNormalizado
      });

      const verbo = tipoNormalizado === 'RETIRADA' ? 'retirada por' : 'devolvida por';
      console.log(`✅ ${ferramenta.nome} ${verbo} ${usuario.nome}.`);
      return res.status(200).json({
        status: "Movimentação registrada",
        ferramenta: ferramenta.nome,
        usuario: usuario.nome,
        tipo: tipoNormalizado
      });
    } catch (error) {
      console.error("❌ Erro ao registrar evento RFID:", error.message);
      return res.status(500).json({ erro: "Erro ao registrar movimentação" });
    }
  }

  async lerTag(req, res) {
    try {
      const tag = cartaoPendente;
      
      if (tag) {
        cartaoPendente = null; // Limpa após o frontend ler
      }

      return res.status(200).json({ tag });
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao buscar tag" });
    }
  }
}

// Usando o export moderno
export default new RfidController();