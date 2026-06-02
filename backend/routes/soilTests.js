import express from 'express';
import { getAllSoilTests, createSoilTest } from '../controllers/soilTestsController.js';

const router = express.Router();

router.get('/', getAllSoilTests);
router.post('/', createSoilTest);

export default router;
