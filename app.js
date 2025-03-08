import express from 'express';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contactsRouter.js';
import authMiddleware from './middlewares/authMiddleware.js';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/contacts', authMiddleware, contactRoutes);

export default app;
