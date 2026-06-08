// =========================================================================
// SMARTBENCH — FIRMWARE DO ESP32 (Espruino)
// -------------------------------------------------------------------------
// Hardware:
//   - ESP32
//   - Leitor RFID RC522 (SPI)
//   - 1 Chave Push Button (6 pinos) por ferramenta, embaixo da ferramenta
//
// Lógica da bancada (almoxarifado):
//   - Com a ferramenta na bancada, o peso dela mantém o botão pressionado.
//   - Quando a ferramenta SAI da bancada  -> registra um evento RETIRADA pendente.
//   - Quando a ferramenta VOLTA p/ bancada -> registra um evento DEVOLUCAO pendente.
//   - Ao aproximar o crachá no RC522, o evento pendente é CONFIRMADO e enviado
//     pela serial vinculado ao funcionário daquele crachá.
//
// Comunicação com o backend (ponte-usb.js):
//   Para cada movimentação confirmada, é enviada UMA linha estruturada:
//     EVENTO {"tag":"RFID-FER-001","cracha":"AB-CD-12-34","tipo":"RETIRADA"}
//   As demais linhas são apenas logs legíveis para acompanhamento.
// =========================================================================

// ----------------------------- CONFIGURAÇÃO ------------------------------

var FERRAMENTAS = [
  { pino: D13, tag: "RFID-FER-001", nome: "Torquimetro Digital 200Nm" },
  { pino: D14, tag: "RFID-FER-003", nome: "Chave de Impacto Pneumatica" }
];

var TIMEOUT_CONFIRMACAO_MS = 30000;

// ------------------------------- LEITOR RFID -----------------------------

SPI2.setup();
var nfc = require("MFRC522.js").connect(SPI2);

var eventoPendente = null;

// --------------------------------- BOTÕES --------------------------------

function definirPendente(ferramenta, tipo) {
  eventoPendente = {
    tag: ferramenta.tag,
    nome: ferramenta.nome,
    tipo: tipo,
    criadoEm: getTime()
  };
}

function configurarBotao(ferramenta) {
  setWatch(function (evento) {
    if (!evento.state) {
      definirPendente(ferramenta, "RETIRADA");
      console.log("[ALERTA] " + ferramenta.nome + " foi retirada da bancada!");
      console.log(">> Aproxime o cracha no leitor para confirmar a RETIRADA...\n");
    } else {
      definirPendente(ferramenta, "DEVOLUCAO");
      console.log("[OK] " + ferramenta.nome + " recolocada na bancada.");
      console.log(">> Aproxime o cracha no leitor para confirmar a DEVOLUCAO...\n");
    }
  }, ferramenta.pino, { repeat: true, edge: "both", debounce: 50 });
}

FERRAMENTAS.forEach(function (ferramenta) {
  pinMode(ferramenta.pino, "input_pullup");
  configurarBotao(ferramenta);
});

// ------------------------------ LEITURA RFID -----------------------------

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