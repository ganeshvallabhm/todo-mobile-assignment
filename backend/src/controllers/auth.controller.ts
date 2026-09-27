import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Generate a signed JWT containing the user ID
const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
};

// Helper to shape the user response — never expose the password
const userResponse = (user: { _id: unknown; name: string; email: string }) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required' });
      return;
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Invalid email format' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      return;
    }

    // Check for duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ success: false, message: 'Email is already registered' });
      return;
    }

    // Password is hashed automatically via the pre-save hook in the User model
    const user = await User.create({ name, email, password });
    const token = signToken(String(user._id));

    res.status(201).json({ success: true, data: { token, user: userResponse(user) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    // Fetch the user including the password field (normally excluded by the model)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = signToken(String(user._id));
    res.json({ success: true, data: { token, user: userResponse(user) } });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/auth/me  (protected)
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, data: { user: userResponse(user) } });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
