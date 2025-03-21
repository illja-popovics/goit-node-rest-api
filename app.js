import express from 'express';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contactsRouter.js';
import authMiddleware from './middlewares/authMiddleware.js';
import { connectDB } from './db/config.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/contacts', authMiddleware, contactRoutes);

app.use("/avatars", express.static(path.join(__dirname, "public/avatars")));

// Middleware для обробки помилок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});

export default app;
