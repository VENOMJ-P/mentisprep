import Joi from "joi";
import { AppError } from "../utils/error.handler.js";

export const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");

      throw new AppError(errorMessage, 400);
    }

    next();
  };
};

export const userSchemas = {
  register: Joi.object({
    username: Joi.string().min(3).max(50).required(),
    firstname: Joi.string().min(2).max(50).required(),
    lastname: Joi.string().min(2).max(50).required(),
    age: Joi.number().integer().min(1).max(120).required(),
    password: Joi.string().min(6).required(),
  }),

  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
