import express from 'express';
import { getAllFertilizerApplications, createFertilizerApplication } from '../controllers/fertilizerApplicationsController.js';

const router = express.Router();

router.get('/', getAllFertilizerApplications);
router.post('/', createFertilizerApplication);

export default router;
