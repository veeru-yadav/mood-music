import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Music' }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
