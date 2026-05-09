import express from 'express';
import ChatController from '../controllers/ChatController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/status', ChatController.status);
router.get('/',       ChatController.listar);
router.post('/',      ChatController.enviar);

export default router;
