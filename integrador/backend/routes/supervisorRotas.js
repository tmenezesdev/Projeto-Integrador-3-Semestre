import express from 'express';
import SupervisorController from '../controllers/SupervisorController.js';

const router = express.Router();

// Rota para monitoramento - Alinhada com o que o Front-end busca
router.get('/ferramentas-fora', SupervisorController.listarFerramentasFora);

router.get('/historico', SupervisorController.listarHistorico);

// Rota para o botão de check (devolução manual)
router.post('/ferramentas-fora/devolucao', SupervisorController.registrarDevolucaoManual);

export default router;