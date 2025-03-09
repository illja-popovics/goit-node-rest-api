import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import User from '../models/user.js';
import 'dotenv/config';

const tempDir = path.join(process.cwd(), 'temp');
const avatarsDir = path.join(process.cwd(), 'public/avatars');

// Configure multer
const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Generate Gravatar URL
    const avatarURL = gravatar.url(email, { s: '250', d: 'identicon' });
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user with default subscription
    const newUser = await User.create({ 
      email, 
      password: hashedPassword,
      avatarURL, // Store avatar URL
      subscription: 'starter',
    });
    
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message || 'Validation error' });
  }
};

const login = async (req, res) => {
  try {
    console.log("Login request received:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: "Email or password is wrong" });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Password does not match");
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    await user.update({ token });

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const logout = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await user.update({ token: null });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    res.json({ 
      email: req.user.email, 
      subscription: req.user.subscription, 
      avatarURL: req.user.avatarURL,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { id } = req.user;
    const newFileName = `${id}-${Date.now()}${path.extname(req.file.originalname)}`;
    const newFilePath = path.join(avatarsDir, newFileName);

    await fs.rename(req.file.path, newFilePath);

    const avatarURL = `/avatars/${newFileName}`;
    await User.update({ avatarURL }, { where: { id } });

    res.status(200).json({ avatarURL });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { register, login, logout, getCurrentUser, updateAvatar, upload };
