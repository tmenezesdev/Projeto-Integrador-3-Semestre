import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rotas
import './ponte-usb.js';
import produtoRotas from './routes/produtoRotas.js';
import authRotas from './routes/authRotas.js';
import criptografiaRotas from './routes/criptografiaRotas.js';
import usuarioRotas from './routes/usuarioRotas.js';
import supervisorRotas from './routes/supervisorRotas.js';
import adminRotas from './routes/adminRotas.js';
import mecanicoRotas from './routes/mecanicoRotas.js';

// Importar middlewares
import { logMiddleware } from './middlewares/logMiddleware.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

import rfidRotas from './routes/rfidRotas.js';
import chatRotas from './routes/chatRotas.js';

// Carregar variáveis do arquivo .env
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações do servidor
const PORT = process.env.PORT || 3000;


// Middlewares globais
app.use(helmet());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 200
}));

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/rfid', rfidRotas);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos — CORP cross-origin permite que o frontend (porta 3001) carregue as imagens
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Middleware para log de requisições (salva no banco de dados)
app.use(logMiddleware);

// Rotas da API
app.use('/api/auth', authRotas);
app.use('/api/produtos', produtoRotas);
app.use('/api/criptografia', criptografiaRotas);
app.use('/api/usuarios', usuarioRotas);
app.use('/api/supervisor', supervisorRotas);
app.use('/api/admin', adminRotas);
app.use('/api/mecanico', mecanicoRotas);
app.use('/api/chat', chatRotas);

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'API de Produtos - Sistema de Gestão',
        versao: '1.0.0',
        rotas: {
            autenticacao: '/api/auth',
            produtos: '/api/produtos',
            criptografia: '/api/criptografia'
        },
        documentacao: {
            login: 'POST /api/auth/login',
            registrar: 'POST /api/auth/registrar',
            perfil: 'GET /api/auth/perfil',
            listarProdutos: 'GET /api/produtos',
            buscarProduto: 'GET /api/produtos/:id',
            criarProduto: 'POST /api/produtos',
            atualizarProduto: 'PUT /api/produtos/:id',
            excluirProduto: 'DELETE /api/produtos/:id',
            infoCriptografia: 'GET /api/criptografia/info',
            cadastrarUsuario: 'POST /api/criptografia/cadastrar-usuario'
        }
    });
});

// Middleware para tratar rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        sucesso: false,
        erro: 'Rota não encontrada',
        mensagem: `A rota ${req.method} ${req.originalUrl} não foi encontrada`
    });
});

// Middleware global de tratamento de erros (deve ser o último)
app.use(errorMiddleware);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Acesse: http://localhost:${PORT}`);
    console.log(`📚 API de Produtos - Sistema de Gestão`);
    console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

