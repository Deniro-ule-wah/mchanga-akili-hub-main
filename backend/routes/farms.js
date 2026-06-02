import express from 'express';
import { getAllFarms, createFarm } from '../controllers/farmsController.js';

const router = express.Router();

router.get('/', getAllFarms);
router.post('/', createFarm);

export default router;
