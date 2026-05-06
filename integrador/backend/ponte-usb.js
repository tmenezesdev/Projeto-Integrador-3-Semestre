import { SerialPort, ReadlineParser } from 'serialport';

// ATENÇÃO: Mude 'COM3' para a porta USB que o seu ESP32 usa!
const PORTA_USB = 'COM3'; 
const URL_BACKEND = 'http://localhost:3000/api/rfid';

console.log(`🔌 Iniciando escuta na porta USB: ${PORTA_USB}...`);

const port = new SerialPort({ path: PORTA_USB, baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
  console.log('✅ Conexão Serial Aberta! Aguardando o crachá...');
});

parser.on('data', async (dados) => {
  const linha = dados.toString().trim();
  
  // 👉 MODO RAIO-X: Mostra TUDO que chega do cabo, mesmo se for lixo ou erro
  console.log(`[Cabo USB diz]: ${linha}`); 
  
  if (linha.startsWith('{') && linha.endsWith('}')) {
    try {
      const payload = JSON.parse(linha);
      console.log('💳 Cartão lido pelo cabo:', payload.rfidTag);

      const res = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) console.log('📤 Repassado para o Backend com sucesso!');
      
    } catch (error) {
      console.error('Erro ao processar:', error);
    }
  }
});