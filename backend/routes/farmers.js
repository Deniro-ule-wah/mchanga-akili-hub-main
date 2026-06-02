import express from 'express';
import {
  getAllFarmers,
  getFarmerById,
  createFarmer,
  updateFarmer,
  deleteFarmer,
} from '../controllers/farmersController.js';

const router = express.Router();

router.get('/', getAllFarmers);
router.get('/:id', getFarmerById);
router.post('/', createFarmer);
router.put('/:id', updateFarmer);
router.delete('/:id', deleteFarmer);

export default router;
