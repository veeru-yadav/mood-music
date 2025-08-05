import Music from '../models/Music.js';
import User from '../models/User.js';

// @route POST /api/admin/music/upload
export const uploadMusic = async (req, res) => {
  try {
    const { title, artist, mood, climate } = req.body;
    const filePath = req.file.path;

    if (!title || !artist || !mood || !climate || !filePath) {
      return res.status(400).json({ message: 'All fields are required' });
    }

     // Convert mood and climate to arrays if they are strings (handle form-data case)
    if (typeof mood === 'string') {
      mood = mood.split(','); // comma-separated string to array
    }
    if (typeof climate === 'string') {
      climate = climate.split(',');
    }

    // Trim all mood and climate values
    mood = mood.map(m => m.trim());
    climate = climate.map(c => c.trim());


    const newMusic = new Music({
      title,
      artist,
      mood,
      climate,
      fileUrl: filePath,
    });

    await newMusic.save();
    res.status(201).json({ message: 'Music uploaded successfully', music: newMusic });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload music', error: error.message });
  }
};


// @route DELETE /api/admin/music/:id
export const deleteMusic = async (req, res) => {
  const music = await Music.findById(req.params.id);
  if (!music) return res.status(404).json({ message: 'Music not found' });

  await music.deleteOne();
  res.json({ message: 'Music deleted successfully' });
};

// @route PUT /api/admin/music/:id
export const updateMusic = async (req, res) => {
  const music = await Music.findById(req.params.id);
  if (!music) return res.status(404).json({ message: 'Music not found' });

  music.title = req.body.title || music.title;
  music.artist = req.body.artist || music.artist;
  music.mood = req.body.mood || music.mood;
  music.climate = req.body.climate || music.climate;

  await music.save();
  res.json(music);
};


// @route GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Don’t expose password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// @route DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};



