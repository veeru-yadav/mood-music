import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  musics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Music' }],
}, { timestamps: true });

export default mongoose.model('Playlist', playlistSchema);
