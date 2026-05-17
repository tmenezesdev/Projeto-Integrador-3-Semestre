import express from 'express';
import SupervisorController from '../controllers/SupervisorController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadImagens, handleUploadError } from '../middlewares/uploadMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/perfil',       SupervisorController.obterPerfil);
router.put('/perfil',       SupervisorController.atualizarPerfil);
router.put('/perfil/senha', SupervisorController.alterarSenha);
router.get('/perfil/stats', SupervisorController.obterStats);
router.post('/perfil/foto', uploadImagens.single('foto'), handleUploadError, SupervisorController.uploadFoto);

router.get('/ferramentas-fora', SupervisorController.listarFerramentasFora);
router.post('/ferramentas-fora/devolucao', SupervisorController.registrarDevolucaoManual);

router.get('/historico', SupervisorController.listarHistorico);

router.get('/alertas', SupervisorController.listarAlertas);

router.get('/visaogeral', SupervisorController.listarVisaoGeral);
router.get('/fluxo-movimentacoes', SupervisorController.fluxoMovimentacoes);

router.post('/funcionarios', SupervisorController.criarFuncionario);

export default router;
