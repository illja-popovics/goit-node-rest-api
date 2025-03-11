import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getAllContactsForUser,
  getOneContact,
  createContact,
  updateContact,
  deleteContact,
  updateFavoriteStatus
} from '../controllers/contactsControllers.js';

const router = express.Router();

// GET all contacts for authenticated user
router.get('/', authMiddleware, getAllContactsForUser);

// GET a specific contact (only if owned by user)
router.get('/:id', authMiddleware, getOneContact);

// POST a new contact (assigning it to authenticated user)
router.post('/', authMiddleware, createContact);

// PUT update contact (only if owned by user)
router.put('/:id', authMiddleware, updateContact);

// DELETE a contact (only if owned by user)
router.delete('/:id', authMiddleware, deleteContact);

// PATCH update favorite status
router.patch('/:id/favorite', authMiddleware, updateFavoriteStatus);

export default router;
