import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  likeMusic,
  unlikeMusic
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/like/:musicId', protect, likeMusic);
router.post('/unlike/:musicId', protect, unlikeMusic);

export default router;
