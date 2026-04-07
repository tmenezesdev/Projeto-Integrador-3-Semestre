import { hashPassword } from './config/database.js';

async function gerar() {
    const hash = await hashPassword('123456');
    console.log('Cole este hash no seu banco de dados:');
    console.log(hash);
}

gerar();