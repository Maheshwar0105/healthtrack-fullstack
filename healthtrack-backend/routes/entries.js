import express from 'express';
import {
  getEntries,
  getNearbyEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  validateEntry
} from '../controllers/entryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getEntries);
router.get('/nearby', protect, getNearbyEntries);
router.post('/', protect, validateEntry, createEntry);
router.put('/:id', protect, validateEntry, updateEntry);
router.delete('/:id', protect, deleteEntry);

export default router;
