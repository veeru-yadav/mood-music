import express from 'express';
import { uploadMusic, deleteMusic, updateMusic, getAllUsers, deleteUser, getAllPlaylists, getAnalysisStats } from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Upload music (admin only)
router.post('/upload', protect, isAdmin, upload.single('audio'), uploadMusic);

// Get all users (optional admin dashboard)
router.get('/users', protect, isAdmin, getAllUsers);

// Delete a user (optional)
router.delete('/users/:id', protect, isAdmin, deleteUser);

// Update a music track (admin only)
router.put('/music/:id', protect, isAdmin, updateMusic);

// Delete a music track (admin only)
router.delete('/music/:id', protect, isAdmin, deleteMusic);

router.get("/playlists", protect, isAdmin, getAllPlaylists);

router.get("/analysis", protect, isAdmin, getAnalysisStats);


export default router;
