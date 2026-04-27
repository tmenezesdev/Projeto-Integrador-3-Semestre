import express from 'express';
import SupervisorController from '../controllers/SupervisorController.js';

const router = express.Router();

router.get('/ferramentas-fora', SupervisorController.listarFerramentasFora);
router.post('/ferramentas-fora/devolucao', SupervisorController.registrarDevolucaoManual);

router.get('/historico', SupervisorController.listarHistorico);

router.get('/alertas', SupervisorController.listarAlertas);

router.get('/visaogeral', SupervisorController.listarVisaoGeral);
router.get('/fluxo-movimentacoes', SupervisorController.fluxoMovimentacoes);

router.post('/funcionarios', SupervisorController.criarFuncionario);

export default router;
