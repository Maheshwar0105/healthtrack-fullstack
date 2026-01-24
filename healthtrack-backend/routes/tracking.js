import express from 'express';
import {
  createSession,
  addPoint,
  endSession,
  getSession
} from '../controllers/trackingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/session', protect, createSession);
router.post('/session/:sessionId/point', protect, addPoint);
router.put('/session/:sessionId/end', protect, endSession);
router.get('/session/:sessionId', protect, getSession);

export default router;

