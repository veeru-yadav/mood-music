import express from 'express';
import {
  createPlaylist,
  getUserPlaylists,
  addMusicToPlaylist,
  removeMusicFromPlaylist,
  deletePlaylist,
} from '../controllers/playlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createPlaylist);
router.get('/', protect, getUserPlaylists);
router.put('/:playlistId/add', protect, addMusicToPlaylist);
router.put('/:playlistId/remove', protect, removeMusicFromPlaylist);
router.delete('/:playlistId', protect, deletePlaylist);

export default router;
