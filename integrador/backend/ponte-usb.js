// =========================================================================
// PONTE SERIAL — SMARTBENCH IOT
// Lê os eventos do ESP32 (firmware em integrador/iot/firmware-esp32.js) pela
// porta USB/serial e registra a transação correta (RETIRADA ou DEVOLUCAO)
// no banco de dados. A trigger trg_atualiza_status_ferramenta cuida de
// mudar o status da ferramenta (EM_USO / DISPONIVEL) automaticamente.
//
// O firmware envia, para cada movimentação confirmada por crachá, UMA linha
// estruturada no formato:
//   EVENTO {"tag":"RFID-FER-001","cracha":"AB-CD-12-34","tipo":"RETIRADA"}
// =========================================================================

import { SerialPort, ReadlineParser } from 'serialport';
import FerramentaModel from './models/FerramentaModel.js';
import UsuarioModel from './models/UsuarioModel.js';
import TransacaoModel from './models/TransacaoModel.js';
import { setCartaoPendente } from './controllers/RfidController.js';

const PORTA_COM = 'COM3';
const BAUD_RATE = 115200;
const SERIAL_HABILITADO = process.env.IOT_SERIAL_ENABLED !== 'false';

const PREFIXO_EVENTO = 'EVENTO ';
const PREFIXO_CRACHA = 'CRACHA ';

let port = null;

if (!SERIAL_HABILITADO) {
  console.log('🔌 Ponte Serial desativada (IOT_SERIAL_ENABLED=false).');
} else {
  try {
    port = new SerialPort({ path: PORTA_COM, baudRate: BAUD_RATE });

    // Delimiter '\n' aceita tanto \n quanto \r\n (o trim em processarLinha
    // remove o \r remanescente). Mais robusto que exigir os dois bytes juntos.
    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
    parser.on('data', (linha) => processarLinha(linha));

    // O log de "ativa" só sai quando a porta ABRE de fato. Antes ele saía
    // mesmo com a porta negada (erro é assíncrono), dando falso positivo.
    port.on('open', () => {
      console.log(`🔌 Ponte Serial ativa. Monitorando a bancada em ${PORTA_COM} (${BAUD_RATE} baud)...`);
    });

    // Erros de conexão (porta ocupada / inexistente) não derrubam o backend.
    port.on('error', (err) => {
      console.error('❌ Erro na porta serial do IoT:', err.message);
      console.error('   Cadastro/movimentação por crachá ficará INDISPONÍVEL até liberar a porta.');
    });
  } catch (err) {
    console.error(`⚠️ Não foi possível abrir a porta serial ${PORTA_COM}: ${err.message}`);
    console.error('   O backend continuará funcionando normalmente, mas sem o IoT.');
  }
}

async function processarLinha(linha) {
  const texto = (linha || '').replace(/\x1b\[[0-9;]*[A-Za-z]/g, '').replace(/^[>\s]+/, '').replace(/[\r\n]/g, '').trim();
  if (!texto) return;

  console.log(`[Hardware] ${texto}`);
  console.log('DEBUG texto hex:', Buffer.from(texto).toString('hex'));


  if (texto.startsWith(PREFIXO_CRACHA)) {
    try {
      const json = texto.slice(PREFIXO_CRACHA.length);
      console.log('DEBUG cracha raw:', json);
      const { uid } = JSON.parse(json);
      console.log('DEBUG uid extraido:', uid);
      if (uid) {
        setCartaoPendente(uid);
        console.log(`🪪 Crachá disponível para cadastro: ${uid}`);
      }
    } catch (e) {
      console.error('⚠️ Linha CRACHA com JSON inválido:', texto, e.message);
    }
    return;
  }

  if (!texto.startsWith(PREFIXO_EVENTO)) return;

  let evento;
  try {
    evento = JSON.parse(texto.slice(PREFIXO_EVENTO.length));
  } catch (err) {
    console.error('⚠️ Linha EVENTO com JSON inválido:', texto);
    return;
  }

  await registrarEvento(evento);
}

async function registrarEvento({ tag, cracha, tipo } = {}) {
  try {
    if (!tag || !cracha || !tipo) {
      console.error('⚠️ Evento incompleto recebido do hardware:', { tag, cracha, tipo });
      return;
    }

    const tipoNormalizado = String(tipo).toUpperCase();
    if (tipoNormalizado !== 'RETIRADA' && tipoNormalizado !== 'DEVOLUCAO') {
      console.error(`⚠️ Tipo de evento desconhecido: "${tipo}"`);
      return;
    }

    const ferramenta = await FerramentaModel.buscarPorTagRfid(tag);
    if (!ferramenta) {
      console.error(`❌ Ferramenta com tag "${tag}" não encontrada no banco.`);
      return;
    }

    const usuario = await UsuarioModel.buscarPorCracha(cracha);
    if (!usuario) {
      console.error(`❌ Crachá não cadastrado: "${cracha}".`);
      console.error('   Cadastre este UID na coluna usuarios.tag_cracha para vincular ao funcionário.');
      return;
    }

    await TransacaoModel.registrar({
      usuarioId: usuario.id,
      ferramentaId: ferramenta.id,
      tipo: tipoNormalizado
    });

    const verbo = tipoNormalizado === 'RETIRADA' ? 'retirada por' : 'devolvida por';
    console.log(`✅ ${ferramenta.nome} ${verbo} ${usuario.nome}.\n`);
  } catch (erro) {
    console.error('❌ Erro ao salvar transação no banco:', erro.message);
  }
}

export default port;