import express from 'express';
import { getAllYieldOutcomes, createYieldOutcome } from '../controllers/yieldOutcomesController.js';

const router = express.Router();

router.get('/', getAllYieldOutcomes);
router.post('/', createYieldOutcome);

export default router;
