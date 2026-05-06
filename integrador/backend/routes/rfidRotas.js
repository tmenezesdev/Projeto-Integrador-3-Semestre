import express from 'express';
// Atenção ao .js no final, o padrão novo exige isso!
import RfidController from '../controllers/RfidController.js'; 

const router = express.Router();

router.post('/', RfidController.receberTag);
router.get('/', RfidController.lerTag);

export default router;