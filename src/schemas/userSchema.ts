import { Joi } from "express-validation";

const userSchema = {
  body: Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
  }),
};

export default userSchema;
