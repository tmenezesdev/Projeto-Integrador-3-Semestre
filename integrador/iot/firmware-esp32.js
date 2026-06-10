
var FERRAMENTAS = [
  { pino: D13, tag: "RFID-FER-001", nome: "Torquimetro Digital 200Nm" },
  { pino: D14, tag: "RFID-FER-003", nome: "Chave de Impacto Pneumatica" }
];

var TIMEOUT_CONFIRMACAO_MS = 30000;


SPI2.setup();
var nfc = require("MFRC522.js").connect(SPI2);

// Evento aguardando confirmação por crachá:
//   { tag, nome, tipo: "RETIRADA"|"DEVOLUCAO", criadoEm }
var eventoPendente = null;

// --------------------------------- BOTÕES --------------------------------

function definirPendente(ferramenta, tipo) {
  eventoPendente = {
    tag: ferramenta.tag,
    nome: ferramenta.nome,
    tipo: tipo,
    criadoEm: getTime() // segundos
  };
}

function configurarBotao(ferramenta) {
  setWatch(function (e) {
    if (e.state) {
      definirPendente(ferramenta, "DEVOLUCAO");
      console.log("[OK] " + ferramenta.nome + " devolvida.");
      console.log(">> Aproxime o cracha...\n");
    } else {
      definirPendente(ferramenta, "RETIRADA");
      console.log("[ALERTA] " + ferramenta.nome + " retirada!");
      console.log(">> Aproxime o cracha...\n");
    }
  }, ferramenta.pino, { repeat: true, edge: "both", debounce: 50 });
}

FERRAMENTAS.forEach(function (ferramenta) {
  pinMode(ferramenta.pino, "input_pullup");
  configurarBotao(ferramenta);
});

// ------------------------------ LEITURA RFID -----------------------------

// Normaliza o UID retornado pelo RC522 para uma string estável.
function formatarCracha(uuid) {
  if (uuid && typeof uuid === "object" && uuid.join) {
    return uuid.join("-");
  }
  return "" + uuid;
}

function confirmarComCracha(cracha) {
  var payload = {
    tag: eventoPendente.tag,
    cracha: cracha,
    tipo: eventoPendente.tipo
  };

  // Linha consumida pela ponte-usb.js — NAO altere o prefixo "EVENTO ".
  console.log("EVENTO " + JSON.stringify(payload));

  console.log("=============================================");
  console.log((eventoPendente.tipo === "RETIRADA" ? "RETIRADA" : "DEVOLUCAO") +
    " CONFIRMADA: " + eventoPendente.nome);
  console.log("Cracha: " + cracha + " vinculado a movimentacao!");
  console.log("=============================================\n");

  eventoPendente = null;
}

setInterval(function () {
  // Expira evento pendente antigo (operador moveu a ferramenta e nao passou o cracha)
  if (eventoPendente &&
    (getTime() - eventoPendente.criadoEm) * 1000 > TIMEOUT_CONFIRMACAO_MS) {
    console.log("[INFO] Tempo esgotado para " + eventoPendente.nome +
      ". Movimentacao cancelada (sem cracha).\n");
    eventoPendente = null;
  }

  nfc.findCards(function (uuid) {
    if (!uuid) return;

    var cracha = formatarCracha(uuid);

    if (eventoPendente) {
      confirmarComCracha(cracha);
    } else {
      // Linha consumida pela ponte-usb.js para cadastro de usuário.
      console.log("CRACHA " + JSON.stringify({ uid: cracha }));
      console.log("[INFO] Cracha lido (" + cracha + ") sem movimentacao pendente.\n");
    }
  });
}, 500);

// --------------------------------- BOOT ----------------------------------

console.log("=============================================");
console.log("SISTEMA DE ALMOXARIFADO (SMARTBENCH) INICIADO!");
console.log("Monitorando " + FERRAMENTAS.length + " ferramenta(s) na bancada...");
console.log("=============================================\n");