import express from 'express';

import { register, login, logout, getCurrentUser, updateAvatar } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js'; 

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/current', authMiddleware, getCurrentUser);
router.patch("/avatars", authMiddleware, upload.single("avatar"), updateAvatar); 

export default router;
