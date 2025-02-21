import { listContacts, getContactById, addContact, removeContact } from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

// GET /api/contacts
export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await listContacts();
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
};

// GET /api/contacts/:id
export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await getContactById(id);
        if (!contact) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

// DELETE /api/contacts/:id
export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await removeContact(id);
        if (!contact) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

// POST /api/contacts
export const createContact = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;
        const newContact = await addContact(name, email, phone);
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
};

// PUT /api/contacts/:id
export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (Object.keys(updateData).length === 0) {
            throw HttpError(400, "Body must have at least one field");
        }
        const updatedContact = await updateContact(id, updateData);
        if (!updatedContact) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(updatedContact);
    } catch (error) {
        next(error);
    }
};
