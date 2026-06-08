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