import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  likeMusic,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/like/:musicId', protect, likeMusic);

export default router;
