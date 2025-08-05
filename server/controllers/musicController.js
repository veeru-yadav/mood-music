import Music from '../models/Music.js';
import path from 'path';
import fs from 'fs';



// @route GET /api/music
export const getAllMusic = async (req, res) => {
  const musicList = await Music.find();
  res.json(musicList);
};

// @route GET /api/music/:id
export const getMusicById = async (req, res) => {
  const music = await Music.findById(req.params.id);
  if (!music) return res.status(404).json({ message: 'Music not found' });
  res.json(music);
};

// GET /api/music/suggest?mood=happy&climate=sunny
export const getMusicByMoodAndClimate = async (req, res) => {
  try {
    const { mood, climate } = req.query;

    
    if (!mood || !climate) {
      return res.status(400).json({ message: 'Mood and climate are required' });
    }

    const query = {
      mood: { $in: [mood.trim()] },
      climate: { $in: [climate.trim()] },
    };

    const music = await Music.find(query);

    res.status(200).json(music);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get suggestions', error });
  }
};



// GET /api/music/stream/:id
export const streamMusicById = async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) return res.status(404).json({ message: 'Music not found' });

    const filePath = path.resolve(music.fileUrl); // assuming 'filename' in DB
    const stat = fs.statSync(filePath);
    const total = stat.size;

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': total,
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: 'Could not stream music', err });
  }
};

