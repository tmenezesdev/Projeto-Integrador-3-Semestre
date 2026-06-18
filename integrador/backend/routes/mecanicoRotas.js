import express from 'express';
import MecanicoController from '../controllers/MecanicoController.js';
import { authMiddleware, mecanicoMiddleware } from '../middlewares/authMiddleware.js';
import { uploadImagens, handleUploadError } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(mecanicoMiddleware);

router.get('/perfil',       MecanicoController.obterPerfil);
router.put('/perfil',       MecanicoController.atualizarPerfil);
router.put('/perfil/senha', MecanicoController.alterarSenha);
router.get('/perfil/stats', MecanicoController.obterStats);
router.post('/perfil/foto', uploadImagens.single('foto'), handleUploadError, MecanicoController.uploadFoto);

router.get('/minhas-retiradas', MecanicoController.minhasRetiradas);
router.post('/devolucao', MecanicoController.registrarDevolucao);
router.get('/historico', MecanicoController.meuHistorico);
router.get('/alertas', MecanicoController.meusAlertas);
router.get('/ferramentas', MecanicoController.listarFerramentas);

export default router;
