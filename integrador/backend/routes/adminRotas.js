import express from 'express';
import AdminController from '../controllers/AdminController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/dashboard', AdminController.dashboard);
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
