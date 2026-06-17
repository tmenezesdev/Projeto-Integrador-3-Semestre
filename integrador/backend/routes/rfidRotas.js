import express from 'express';
// Atenção ao .js no final, o padrão novo exige isso!
import RfidController from '../controllers/RfidController.js';

const router = express.Router();

// Protege o ingest vindo do agente serial local. Se IOT_INGEST_TOKEN estiver
// definido, exige o header x-iot-token igual; se não estiver definido, libera
// (com aviso) para não travar antes de configurar o segredo.
function exigirTokenIot(req, res, next) {
  const esperado = process.env.IOT_INGEST_TOKEN;
  if (!esperado) {
    console.warn('⚠️ IOT_INGEST_TOKEN não definido — endpoint de ingest RFID está ABERTO.');
    return next();
  }
  if (req.header('x-iot-token') !== esperado) {
    return res.status(401).json({ erro: 'Token de IoT inválido' });
  }
  next();
}

// GET (polling do frontend no cadastro) continua aberto.
router.get('/', RfidController.lerTag);

// POSTs vêm do agente serial local → exigem token.
router.post('/', exigirTokenIot, RfidController.receberTag);
router.post('/evento', exigirTokenIot, RfidController.receberEvento);

export default router;