import express from 'express';

import {
  getAllMusic,
  getMusicById,
  getMusicByMoodAndClimate,
  streamMusicById,
} from '../controllers/musicController.js';
import { protect } from '../middleware/auth.js'; 



const router = express.Router();

// Get all music
router.get('/', protect, getAllMusic);

// Filtered music based on mood and weather
router.get('/suggest', protect, getMusicByMoodAndClimate);

// Get music by ID
router.get('/:id', protect, getMusicById);

// Streaming route (frontend plays music from this)
router.get('/stream/:id', protect, streamMusicById);

export default router;
