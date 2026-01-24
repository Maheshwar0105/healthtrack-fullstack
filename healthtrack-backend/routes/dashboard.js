import express from 'express';
import { getTodayStats, getProgress, getMapData } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/today', protect, getTodayStats);
router.get('/progress', protect, getProgress);
router.get('/map', protect, getMapData);

export default router;
