import Contact from '../models/contact.js';

// Get all contacts for a specific user
export const getAllContacts = async (userId) => {
  return await Contact.findAll({ where: { owner: userId } });
};

// Get a single contact by ID (only if owned by user)
export const getContactById = async (id, userId) => {
  return await Contact.findOne({ where: { id, owner: userId } });
};

// Add a new contact for a specific user
export const addContact = async (data, userId) => {
  if (!userId) {
    throw new Error("User ID is required for adding a contact");
  }
  return await Contact.create({ ...data, owner: userId });
};

// Update a contact (only if owned by user)
export const updateContact = async (id, data, userId) => {
  const contact = await Contact.findOne({ where: { id, owner: userId } });
  if (!contact) return null;
  return await contact.update(data);
};

// Delete a contact (only if owned by user)
export const deleteContact = async (id, userId) => {
  const contact = await Contact.findOne({ where: { id, owner: userId } });
  if (!contact) return null;
  await contact.destroy();
  return contact;
};

// Update the "favorite" status of a contact (only if owned by user)
export const updateStatusContact = async (id, favorite, userId) => {
  const contact = await Contact.findOne({ where: { id, owner: userId } });
  if (!contact) return null;
  contact.favorite = favorite;
  await contact.save();
  return contact;
};
