import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  const { username, email, password, address, role } = req.body;

  if (!username || !email || !password || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword, address, role });

  res.status(201).json({
    id: user.id,
    username: user.username,
    email: user.email,
    address: user.address,
    role: user.role,
    token: generateToken(user.id),
  });
};

// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email } );
  if (!user) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    address: user.address,
    role: user.role,
    likes: user.likes,
    playlists: user.playlists,
    token: generateToken(user.id),
  });
};


