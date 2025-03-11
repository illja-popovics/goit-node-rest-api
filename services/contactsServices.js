import Contact from '../models/contact.js';

// Get all contacts for a specific user
export const getAllContacts = async (userId) => {
  return await Contact.findAll({ where: { owner: userId } });
};

// Get a single contact by ID (only if owned by user)
export const getContactById = async (id, userId) => {
  const contact = await Contact.findOne({ where: { id, owner: userId } });
  return contact || null;  // ✅ Fix to avoid throwing an error directly
};

// Add a new contact for a specific user
export const addContact = async (data, userId) => {
  return await Contact.create({ ...data, owner: userId, favorite: data.favorite ?? false });
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
  await contact.update({ favorite });
  return contact;
};
