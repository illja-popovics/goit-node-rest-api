import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import { v4 as uuidv4 } from "uuid"; // Пакет для генерації унікального токена
import { sendVerificationEmail } from "../services/emailService.js";
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

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4(); // Генеруємо токен

    const newUser = await User.create({
      email,
      password: hashedPassword,
      verify: false,
      verificationToken,
    });

    await sendVerificationEmail(email, verificationToken); // Надсилаємо лист

    res.status(201).json({
      message: "User registered. Check your email for verification link.",
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    if (!user.verify) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    await user.update({ token });

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
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

    try {
      await fs.rename(req.file.path, newFilePath);
    } catch (error) {
      console.error("Error moving file:", error);
      // Видалення файлу з temp у разі помилки переміщення
      await fs.unlink(req.file.path);
      return res.status(500).json({ message: 'Error processing avatar upload' });
    }

    const avatarURL = `/avatars/${newFileName}`;
    await User.update({ avatarURL }, { where: { id } });

    res.status(200).json({ avatarURL });
  } catch (error) {
    console.error("Avatar update error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ where: { verificationToken } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ verify: true, verificationToken: null });

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Missing required field email" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res.status(400).json({ message: "Verification has already been passed" });
    }

    await sendVerificationEmail(email, user.verificationToken);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export { register, login, logout, getCurrentUser, updateAvatar, upload, verifyEmail, resendVerificationEmail };
