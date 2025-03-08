import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/config.js';
import contactsRouter from './routes/contactsRouter.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/contacts', contactsRouter);

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});
