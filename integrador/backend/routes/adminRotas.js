import express from 'express';
import AdminController from '../controllers/AdminController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import { uploadImagens, handleUploadError } from '../middlewares/uploadMiddleware.js';

const router = express.Router();
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/perfil',       AdminController.obterPerfil);
router.put('/perfil',       AdminController.atualizarPerfil);
router.put('/perfil/senha', AdminController.alterarSenha);
router.get('/perfil/stats', AdminController.obterStats);
router.post('/perfil/foto', uploadImagens.single('foto'), handleUploadError, AdminController.uploadFoto);

router.get('/dashboard', AdminController.dashboard);
router.get('/ferramentas-em-uso', AdminController.listarEmUso);
router.get('/usuarios', AdminController.listarUsuarios);
router.post('/usuarios', AdminController.criarUsuario);
router.put('/usuarios/:id', AdminController.atualizarUsuario);
router.delete('/usuarios/:id', AdminController.excluirUsuario);
router.get('/ferramentas', AdminController.listarFerramentas);
router.post('/ferramentas', AdminController.criarFerramenta);
router.put('/ferramentas/:id', AdminController.atualizarFerramenta);
router.delete('/ferramentas/:id', AdminController.excluirFerramenta);
router.get('/historico', AdminController.listarHistorico);
router.get('/alertas', AdminController.listarAlertas);
router.put('/alertas/:id/resolver', AdminController.resolverAlerta);
router.get('/fluxo-movimentacoes', AdminController.fluxoMovimentacoes);
router.get('/configuracoes', AdminController.obterConfiguracoes);
router.put('/configuracoes', AdminController.atualizarConfiguracoes);

export default router;
