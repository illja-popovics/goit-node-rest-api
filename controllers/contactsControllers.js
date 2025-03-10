import { getAllContacts, getContactById, addContact, deleteContact as removeContact, updateContact as modifyContact } from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

// GET /api/contacts (Retrieve only contacts belonging to the authenticated user)
export const getAllContactsForUser = async (req, res, next) => {
    try {
        const userId = req.user.id; // Get user ID from authentication middleware
        const contacts = await getAllContacts(userId);
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
};

// GET /api/contacts/:id (Retrieve a single contact only if it belongs to the user)
export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const contact = await getContactById(id, userId);
        if (!contact) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

// DELETE /api/contacts/:id (Delete a contact only if it belongs to the user)
export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const contact = await removeContact(id, userId);
        if (!contact) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// POST /api/contacts (Create a new contact and assign it to the authenticated user)
export const createContact = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;
        const userId = req.user.id;  // ✅ Get the authenticated user's ID

        if (!userId) {
            throw HttpError(401, "Unauthorized: Missing user ID");
        }

        const newContact = await addContact({ name, email, phone, owner: userId }); // ✅ Assign owner
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
};


// PUT /api/contacts/:id (Update a contact only if it belongs to the user)
export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const userId = req.user.id;
        
        if (Object.keys(updateData).length === 0) {
            throw HttpError(400, "Body must have at least one field");
        }

        const updatedContact = await modifyContact(id, updateData, userId);
        if (!updatedContact) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(updatedContact);
    } catch (error) {
        next(error);
    }
};
