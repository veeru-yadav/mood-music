import User from '../models/User.js';
import Music from '../models/Music.js';
import bcrypt from 'bcryptjs';

// @route GET /api/user/profile
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('username email address role createdAt');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
};

// @route PUT /api/user/profile
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  user.address = req.body.address || user.address;

  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }

  await user.save();

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    createdAt: user.createdAt,
    role: user.role,
  });
};


// @route POST /api/user/like/:musicId
export const likeMusic = async (req, res) => {
  try {
    const userId = req.user.id; // assuming JWT middleware sets req.user
    const { musicId } = req.params;

    const user = await User.findById(userId);
    //const music = await Music.findById(musicId);

    // if (!user || !music) {
    //   return res.status(404).json({ message: 'User or Music not found' });
    // }

    // Check if already liked
    if (user.likes.includes(musicId)) {
      return res.status(400).json({ message: 'Music already liked' });
    }

    // Add music to user likes
    user.likes.push(musicId);
    await user.save();

    // Increment music likes count
    // music.likes += 1;
    // await music.save();

    res.status(200).json({ message: 'Music liked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to like music', err });
  }
};

export const unlikeMusic = async (req , res ) => {
  try{
    const userId = req.user.id; // assuming JWT middleware sets req.user
    const { musicId } = req.params;

    const user = await User.findById(userId);

    if (!user.likes.includes(musicId)) {
      return res.status(400).json({ message: 'Music not liked yet' });
    }

    user.likes = user.likes.filter(id => id !== musicId);
    await user.save();

    res.status(200).json({ message: 'Music unliked successfully' });
  } catch(err){
    res.status(500).json({ message: 'Failed to unlike music', err });
  }
};