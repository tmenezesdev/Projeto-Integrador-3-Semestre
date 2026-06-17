import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import './ponte-usb.js';
import authRotas from './routes/authRotas.js';
import supervisorRotas from './routes/supervisorRotas.js';
import adminRotas from './routes/adminRotas.js';
import mecanicoRotas from './routes/mecanicoRotas.js';
import rfidRotas from './routes/rfidRotas.js';
import chatRotas from './routes/chatRotas.js';

import { logMiddleware } from './middlewares/logMiddleware.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// CORS antes do helmet para garantir headers corretos
const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : '*';

app.use(cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 200
}));

app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
}));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rfid montado DEPOIS do express.json() para que POST /api/rfid consiga ler req.body
app.use('/api/rfid', rfidRotas);

app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.join(__dirname, 'uploads')));

app.use(logMiddleware);

app.use('/api/auth', authRotas);
app.use('/api/supervisor', supervisorRotas);
app.use('/api/admin', adminRotas);
app.use('/api/mecanico', mecanicoRotas);
app.use('/api/chat', chatRotas);

app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'SmartBench API - Sistema de Gestão de Ferramentas',
        versao: '1.0.0',
        rotas: {
            autenticacao: '/api/auth',
            admin: '/api/admin',
            supervisor: '/api/supervisor',
            mecanico: '/api/mecanico',
            chat: '/api/chat',
            rfid: '/api/rfid'
        }
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        sucesso: false,
        erro: 'Rota não encontrada',
        mensagem: `A rota ${req.method} ${req.originalUrl} não foi encontrada`
    });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Acesse: http://localhost:${PORT}`);
    console.log(`📚 SmartBench API - Sistema de Gestão de Ferramentas`);
    console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

export default app;