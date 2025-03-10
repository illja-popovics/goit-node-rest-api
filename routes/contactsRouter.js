import express from 'express';
import {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
  updateStatusContact,
} from '../services/contactsServices.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET all contacts for authenticated user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const contacts = await getAllContacts(req.user.id);
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

// GET a specific contact (only if owned by user)
router.get('/:contactId', authMiddleware, async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId, req.user.id);
    if (!contact) return res.status(404).json({ message: 'Not found' });
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

// POST a new contact (assigning it to authenticated user)
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const newContact = await addContact(req.body, req.user.id);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

// PUT update contact (only if owned by user)
router.put('/:contactId', authMiddleware, async (req, res, next) => {
  try {
    const updatedContact = await updateContact(req.params.contactId, req.body, req.user.id);
    if (!updatedContact) return res.status(404).json({ message: 'Not found' });
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

// DELETE a contact (only if owned by user)
router.delete('/:contactId', authMiddleware, async (req, res, next) => {
  try {
    const deletedContact = await deleteContact(req.params.contactId, req.user.id);
    if (!deletedContact) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// PATCH update contact favorite status (only if owned by user)
router.patch('/:contactId/favorite', authMiddleware, async (req, res, next) => {
  try {
    const { favorite } = req.body;
    if (typeof favorite !== 'boolean') return res.status(400).json({ message: 'Invalid input' });
    const updatedContact = await updateStatusContact(req.params.contactId, favorite, req.user.id);
    if (!updatedContact) return res.status(404).json({ message: 'Not found' });
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

export default router;