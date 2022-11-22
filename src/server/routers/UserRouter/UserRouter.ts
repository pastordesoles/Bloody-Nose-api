import express from "express";
import multer from "multer";
import path from "path";
import { validate } from "express-validation";
import { registerUser } from "../../controllers/userControllers/userControllers.js";
import routes from "../routes.js";
import userSchema from "../../../schemas/userSchema.js";

const { register } = routes;

const upload = multer({
  dest: path.join("assets", "images"),
});

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post(
  register,
  upload.single("picture"),
  validate(userSchema, {}, { abortEarly: false }),
  registerUser
);

export default userRouter;
