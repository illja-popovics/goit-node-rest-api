import express from 'express';
import multer from "multer";

import { register, login, logout, getCurrentUser } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { updateAvatar } from "../controllers/authController.js";


const router = express.Router();
const upload = multer({ dest: "temp/" }); // Temporary storage

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/current', authMiddleware, getCurrentUser);
router.patch("/avatars", authMiddleware, upload.single("avatar"), updateAvatar);

export default router;