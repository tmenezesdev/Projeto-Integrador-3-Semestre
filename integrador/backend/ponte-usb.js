// =========================================================================
// AGENTE SERIAL — SMARTBENCH IOT (roda LOCALMENTE, na máquina com o ESP32)
// Lê os eventos do ESP32 (firmware em integrador/iot/firmware-esp32.js) pela
// porta USB/serial e os ENCAMINHA para o backend na nuvem via HTTP. O backend
// (que tem acesso ao banco) registra a transação; a trigger
// trg_atualiza_status_ferramenta cuida do status da ferramenta.
//
// Por que separado do backend: um servidor na nuvem (Railway) não tem porta
// USB, então a leitura serial precisa rodar onde o hardware está plugado.
// Execução: `npm run bridge` (com o Espruino Web IDE / Serial Monitor FECHADO,
// pois só 1 processo por vez consegue abrir uma COM).
//
// Linhas consumidas (uma por linha, vindas do firmware):
//   EVENTO {"tag":"RFID-FER-001","cracha":"AB-CD-12-34","tipo":"RETIRADA"}
//   CRACHA {"uid":"AB-CD-12-34"}
// =========================================================================

import dotenv from 'dotenv';
import { SerialPort, ReadlineParser } from 'serialport';

dotenv.config();

// Porta e velocidade configuráveis pelo .env (default: COM3 a 115200 baud,
// que é o que o firmware Espruino usa).
const PORTA_COM = process.env.PORTA_SERIAL || 'COM3';
const BAUD_RATE = Number(process.env.BAUD_SERIAL) || 115200;
const SERIAL_HABILITADO = process.env.IOT_SERIAL_ENABLED !== 'false';
const RECONNECT_MS = 3000;

// Backend na nuvem para onde os eventos são empurrados, e o token compartilhado.
const API_URL = (process.env.API_URL || 'https://projeto-integrador-3-semestre-production-197e.up.railway.app').replace(/\/+$/, '');
const IOT_TOKEN = process.env.IOT_INGEST_TOKEN || '';

// Encaminha um payload para o backend na nuvem. Erros de rede são logados sem
// derrubar o agente — a próxima leitura tenta de novo.
async function enviarParaNuvem(caminho, payload) {
  try {
    const resp = await fetch(API_URL + caminho, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-iot-token': IOT_TOKEN },
      body: JSON.stringify(payload)
    });
    const corpo = await resp.json().catch(() => ({}));
    if (resp.ok) {
      console.log(`☁️  POST ${caminho} → ${resp.status}`, corpo.status || corpo.ferramenta || '');
    } else {
      console.error(`❌ POST ${caminho} → ${resp.status}:`, corpo.erro || corpo);
    }
  } catch (err) {
    console.error(`❌ Falha de rede ao enviar para a nuvem (${caminho}):`, err.message);
  }
}

const PREFIXO_EVENTO = 'EVENTO ';
const PREFIXO_CRACHA = 'CRACHA ';

let port = null;
let reconectando = null; // guarda o timer para não empilhar reconexões

// Loga uma mensagem acionável quando a porta não abre. O motivo nº 1 é a porta
// estar ocupada por outro programa (Espruino Web IDE / Serial Monitor) — só um
// processo por vez consegue abrir uma COM.
async function diagnosticarErroPorta(mensagem) {
  const msg = String(mensagem || '');
  const ocupada = /access denied|cannot open|resource|busy|in use|permission/i.test(msg);

  console.error('❌ Erro na porta serial do IoT:', msg);
  if (ocupada) {
    console.error(`   ⚠️ A porta ${PORTA_COM} parece OCUPADA por outro programa.`);
    console.error('   Feche o Espruino Web IDE / Serial Monitor (só 1 processo por COM) e tente de novo.');
  }
  console.error('   Cadastro/movimentação por crachá ficará INDISPONÍVEL até liberar a porta.');

  try {
    const portas = await SerialPort.list();
    if (portas.length) {
      console.error('   Portas seriais disponíveis no momento:');
      portas.forEach((p) => console.error(`     - ${p.path}${p.manufacturer ? ` (${p.manufacturer})` : ''}`));
    } else {
      console.error('   Nenhuma porta serial encontrada — verifique se o ESP32 está plugado.');
    }
  } catch { /* SerialPort.list pode falhar em alguns ambientes; ignorar */ }
}

function agendarReconexao() {
  if (reconectando) return; // já há uma reconexão agendada
  console.error(`   ↻ Nova tentativa de abrir ${PORTA_COM} em ${RECONNECT_MS / 1000}s...`);
  reconectando = setTimeout(() => {
    reconectando = null;
    abrirPorta();
  }, RECONNECT_MS);
}

function abrirPorta() {
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

    // Erros de conexão (porta ocupada / inexistente) não derrubam o agente.
    // Diagnostica e reagenda a abertura — assim, ao liberar a porta (fechar o
    // IDE), o agente volta sozinho sem precisar reiniciá-lo.
    port.on('error', async (err) => {
      await diagnosticarErroPorta(err.message);
      agendarReconexao();
    });

    // Se a porta fechar (cabo removido, outro programa assumiu), tenta reabrir.
    port.on('close', () => {
      console.error(`🔌 Porta ${PORTA_COM} fechada.`);
      agendarReconexao();
    });
  } catch (err) {
    console.error(`⚠️ Não foi possível abrir a porta serial ${PORTA_COM}: ${err.message}`);
    agendarReconexao();
  }
}

if (!SERIAL_HABILITADO) {
  console.log('🔌 Ponte Serial desativada (IOT_SERIAL_ENABLED=false).');
} else {
  abrirPorta();
}

async function processarLinha(linha) {
  const texto = (linha || '').replace(/\x1b\[[0-9;]*[A-Za-z]/g, '').replace(/^[>\s]+/, '').replace(/[\r\n]/g, '').trim();
  if (!texto) return;

  console.log(`[Hardware] ${texto}`);

  if (texto.startsWith(PREFIXO_CRACHA)) {
    try {
      const { uid } = JSON.parse(texto.slice(PREFIXO_CRACHA.length));
      if (uid) {
        console.log(`🪪 Crachá lido para cadastro: ${uid}`);
        await enviarParaNuvem('/api/rfid', { rfidTag: uid });
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

  const { tag, cracha, tipo } = evento || {};
  if (!tag || !cracha || !tipo) {
    console.error('⚠️ Evento incompleto recebido do hardware:', evento);
    return;
  }
  await enviarParaNuvem('/api/rfid/evento', { tag, cracha, tipo });
}