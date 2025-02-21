import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";

import { validateBody } from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

const router = express.Router();

router.get("/", getAllContacts);
router.get("/:id", getOneContact);

router.post("/", validateBody(createContactSchema), createContact);
router.put("/:id", validateBody(updateContactSchema), updateContact);

router.delete("/:id", deleteContact);

export default router;
