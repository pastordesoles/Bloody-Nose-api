import { Joi } from "express-validation";

const sessionSchema = {
  body: Joi.object({
    title: Joi.string().min(3).required(),
    location: Joi.string().min(5).required(),
    participants: Joi.number().required(),
    material: Joi.string().min(3).required(),
    level: Joi.string().min(3).required(),
    content: Joi.string().min(5).required(),
    style: Joi.string()
      .valid("karate", "boxing", "kickboxing", "mma")
      .required(),
    length: Joi.number().required(),
    date: Joi.string().min(4).required(),
  }),
};

export default sessionSchema;
