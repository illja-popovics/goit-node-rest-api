import Joi from "joi";

// Schema for creating a new contact
export const createContactSchema = Joi.object({
    name: Joi.string().min(2).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name should have at least 2 characters"
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address"
    }),
    phone: Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{4}$/).required().messages({
        "string.empty": "Phone is required",
        "string.pattern.base": "Phone must be in the format (123) 456-7890"
    })
});

// Schema for updating an existing contact
export const updateContactSchema = Joi.object({
    name: Joi.string().min(2).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{4}$/).optional()
}).or('name', 'email', 'phone').messages({
    "object.missing": "Body must have at least one field"
});
