import express from 'express';
import {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
  updateStatusContact,
} from '../services/contactsServices.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const contacts = await getAllContacts();
  res.json(contacts);
});

router.get('/:contactId', async (req, res) => {
  const contact = await getContactById(req.params.contactId);
  if (!contact) return res.status(404).json({ message: 'Not found' });
  res.json(contact);
});

router.post('/', async (req, res) => {
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
});

router.put('/:contactId', async (req, res) => {
  const updatedContact = await updateContact(req.params.contactId, req.body);
  if (!updatedContact) return res.status(404).json({ message: 'Not found' });
  res.json(updatedContact);
});

router.delete('/:contactId', async (req, res) => {
  const deletedContact = await deleteContact(req.params.contactId);
  if (!deletedContact) return res.status(404).json({ message: 'Not found' });
  res.json(deletedContact);
});

router.patch('/:contactId/favorite', async (req, res) => {
  const { favorite } = req.body;
  if (typeof favorite !== 'boolean') return res.status(400).json({ message: 'Invalid input' });
  const updatedContact = await updateStatusContact(req.params.contactId, favorite);
  if (!updatedContact) return res.status(404).json({ message: 'Not found' });
  res.json(updatedContact);
});

export default router;
