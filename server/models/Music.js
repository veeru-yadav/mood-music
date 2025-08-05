import mongoose from 'mongoose';

const musicSchema = new mongoose.Schema({
  title: String,
  artist: String,
  mood: [String],
  climate: [String],
  fileUrl: String,
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Music', musicSchema);
