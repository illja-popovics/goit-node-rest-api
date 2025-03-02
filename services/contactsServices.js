import Contact from '../models/contact.js'; // Import Contact model

export const getAllContacts = async () => {
  return await Contact.findAll();
};

export const getContactById = async (id) => {
  return await Contact.findByPk(id);
};

export const addContact = async (data) => {
  return await Contact.create(data);
};

export const updateContact = async (id, data) => {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  return await contact.update(data);
};

export const deleteContact = async (id) => {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  await contact.destroy();
  return contact;
};

export const updateStatusContact = async (id, favorite) => {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  contact.favorite = favorite;
  await contact.save();
  return contact;
};
