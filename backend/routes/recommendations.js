import express from 'express';
import { getAllRecommendations, createRecommendation } from '../controllers/recommendationsController.js';

const router = express.Router();

router.get('/', getAllRecommendations);
router.post('/', createRecommendation);

export default router;
