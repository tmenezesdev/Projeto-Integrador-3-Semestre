import express from 'express';
import MecanicoController from '../controllers/MecanicoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/minhas-retiradas', MecanicoController.minhasRetiradas);
router.get('/historico', MecanicoController.meuHistorico);
router.get('/alertas', MecanicoController.meusAlertas);
router.get('/ferramentas', MecanicoController.listarFerramentas);

export default router;
