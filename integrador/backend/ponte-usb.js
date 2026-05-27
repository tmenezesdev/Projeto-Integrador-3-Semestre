import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

// Substitua 'COM3' pela porta real do seu ESP32
const portaUSB = 'COM5'; 

const port = new SerialPort({ 
    path: portaUSB, 
    baudRate: 9600 
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

console.log(`🔌 Ponte USB iniciada! Escutando a porta ${portaUSB}...`);

parser.on('data', (linha) => {
    // Tudo o que o ESP32 imprimir no console vai aparecer aqui no Node.js
    console.log(`[ESP32] ${linha}`);
});

port.on('error', (err) => {
    console.log('❌ Erro na porta USB: ', err.message);
});