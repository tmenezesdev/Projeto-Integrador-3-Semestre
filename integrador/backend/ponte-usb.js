import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import FerramentaModel from './models/FerramentaModel.js';
import UsuarioModel from './models/UsuarioModel.js';
import TransacaoModel from './models/TransacaoModel.js';

// Configuração da porta serial do Windows
const PORTA_COM = 'COM3'; 

const port = new SerialPort({ 
  path: PORTA_COM, 
  baudRate: 9600 
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Dicionário de mapeamento: Traduz o texto do ESP32 para a tag_rfid do Banco de Dados
const mapeamentoFerramentas = {
  "Ferramenta 1 (Parafusadeira)": "RFID-FER-001", // Mapeado para o Torquímetro ou outra ferramenta do seed
  "Ferramenta 2 (Chave de Impacto)": "RFID-FER-003" // Mapeado para a Chave de Impacto Pneumática
};

// Variáveis temporárias para segurar o estado entre as linhas lidas do console
let uuidCapturado = null;

console.log(`🔌 Ponte Serial ativa. Monitorando a bancada na porta ${PORTA_COM}...`);

parser.on('data', async (linha) => {
  const texto = linha.trim();
  
  // Exibe o log nativo do hardware no console do Node.js para monitoramento
  console.log(`[Hardware] ${texto}`);

  // 1. Detecta a linha do Crachá Confirmado
  if (texto.includes("CRACHÁ CONFIRMADO:")) {
    uuidCapturado = texto.replace("CRACHÁ CONFIRMADO:", "").trim();
  }

  // 2. Detecta a linha de Registro da Ferramenta vinculada
  if (texto.includes("REGISTRO:") && texto.includes("vinculada ao funcionário!")) {
    // Extrai o nome da ferramenta que está entre "REGISTRO: " e " vinculada..."
    const nomeFerramentaHardware = texto
      .replace("REGISTRO:", "")
      .replace("vinculada ao funcionário!", "")
      .trim();

    if (uuidCapturado && nomeFerramentaHardware) {
      try {
        console.log(`\n⚙️ Processando integração: Crachá [${uuidCapturado}] + [${nomeFerramentaHardware}]`);

        // Traduz o nome do botão do hardware para a tag cadastrada no banco
        const tagRfidBanco = mapeamentoFerramentas[nomeFerramentaHardware];
        if (!tagRfidBanco) {
          console.error(`⚠️ Erro: O nome '${nomeFerramentaHardware}' não está mapeado no dicionário.`);
          return;
        }

        // Busca os IDs correspondentes no banco de dados
        const ferramenta = await FerramentaModel.buscarPorTagRfid(tagRfidBanco);
        const connection = await import('../config/database.js').then(m => m.getConnection());
        
        // Busca direta do usuário usando o mysql2
        const [usuarios] = await connection.execute('SELECT * FROM usuarios WHERE tag_cracha = ?', [uuidCapturado]);
        connection.release();
        const usuario = usuarios[0] || null;

        if (!ferramenta) {
          console.error(`❌ Falha: Ferramenta com tag ${tagRfidBanco} não encontrada no banco.`);
          return;
        }
        if (!usuario) {
          console.error(`❌ Falha: Usuário com crachá ${uuidCapturado} não encontrado no banco.`);
          return;
        }

        // Insere a movimentação como 'RETIRADA' (conforme a lógica do hardware)
        await TransacaoModel.registrar({
          usuarioId: usuario.id,
          ferramentaId: ferramenta.id,
          tipo: 'RETIRADA'
        });

        console.log(`✅ Banco de Dados Atualizado! ${ferramenta.nome} retirada por ${usuario.nome}.\n`);

      } catch (erro) {
        console.error('❌ Erro ao salvar transação no banco:', erro.message);
      } finally {
        // Limpa as variáveis para a próxima leitura
        uuidCapturado = null;
      }
    }
  }
});

port.on('error', (err) => {
  console.error('❌ Erro de conexão física na porta USB:', err.message);
});