import express from 'express';
import { 
  chatAssistant, 
  generateDietPlan, 
  generateWorkoutPlan, 
  generateWeeklyReport 
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', protect, chatAssistant);
router.post('/diet', protect, generateDietPlan);
router.post('/workout', protect, generateWorkoutPlan);
router.get('/report', protect, generateWeeklyReport);

export default router;
