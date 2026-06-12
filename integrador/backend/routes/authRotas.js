import express from 'express';
import AuthController from '../controllers/AuthController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas públicas de autenticação
// OBS: não existe rota pública de cadastro. Usuários são criados apenas por
// ADMIN (/api/admin/usuarios) ou SUPERVISOR (/api/supervisor/funcionarios),
// ambas protegidas — isso evita que qualquer um se registre como ADMIN.
router.post('/login',           AuthController.login);
router.post('/esqueceu-senha',  AuthController.esqueceuSenha);
router.post('/redefinir-senha', AuthController.redefinirSenha);

// Rotas protegidas (precisam de autenticação)
router.get('/perfil', authMiddleware, AuthController.obterPerfil);

// Rotas OPTIONS para CORS (preflight requests)
router.options('/login', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

router.options('/perfil', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

export default router;


