import { 
  getAllContacts, 
  getContactById, 
  addContact, 
  deleteContact as removeContact, 
  updateContact as modifyContact,
  updateStatusContact
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

// GET all contacts for authenticated user
export const getAllContactsForUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contacts = await getAllContacts(userId);
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

// GET a specific contact (only if owned by user)
export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const contact = await getContactById(id, userId);
    if (!contact) {
      return next(HttpError(404, "Contact not found"));
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

// DELETE a contact (only if owned by user)
export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const contact = await removeContact(id, userId);
    if (!contact) {
      return next(HttpError(404, "Contact not found"));
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// POST a new contact (assigning it to authenticated user)
export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;
    const userId = req.user.id;
    if (!userId) {
      return next(HttpError(401, "Unauthorized"));
    }
    const newContact = await addContact({ name, email, phone, favorite }, userId);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

// PUT update contact (only if owned by user)
export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user.id;
    if (Object.keys(updateData).length === 0) {
      return next(HttpError(400, "Body must have at least one field"));
    }
    const updatedContact = await modifyContact(id, updateData, userId);
    if (!updatedContact) {
      return next(HttpError(404, "Contact not found"));
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

// PATCH /contacts/:id/favorite (Update favorite status)
export const updateFavoriteStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const userId = req.user.id;

    if (typeof favorite !== "boolean") {
      return next(HttpError(400, "Favorite must be a boolean"));
    }

    const updatedContact = await updateStatusContact(id, favorite, userId);
    if (!updatedContact) {
      return next(HttpError(404, "Contact not found"));
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
