import express from 'express';
import { getAllCropCycles, createCropCycle } from '../controllers/cropCyclesController.js';

const router = express.Router();

router.get('/', getAllCropCycles);
router.post('/', createCropCycle);

export default router;
