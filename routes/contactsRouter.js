import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getAllContactsForUser,
  getOneContact,
  createContact,
  updateContact,
  deleteContact
} from '../controllers/contactsControllers.js';

const router = express.Router();

// GET all contacts for authenticated user
router.get('/', authMiddleware, getAllContactsForUser);

// GET a specific contact (only if owned by user)
router.get('/:contactId', authMiddleware, getOneContact);

// POST a new contact (assigning it to authenticated user)
router.post('/', authMiddleware, createContact);

// PUT update contact (only if owned by user)
router.put('/:contactId', authMiddleware, updateContact);

// DELETE a contact (only if owned by user)
router.delete('/:contactId', authMiddleware, deleteContact);

export default router;
