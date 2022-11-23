/* eslint-disable new-cap */
import express from "express";
import multer from "multer";
import path from "path";
import { validate } from "express-validation";
import {
  registerUser,
  loginUser,
} from "../../controllers/userControllers/userControllers.js";
import routes from "../routes.js";
import userSchema from "../../../schemas/userSchema.js";

const { register, login } = routes;

const upload = multer({
  dest: path.join("assets", "images"),
});

const userRouter = express.Router();

userRouter.post(
  register,
  upload.single("picture"),
  validate(userSchema, {}, { abortEarly: false }),
  registerUser
);

userRouter.post(login, loginUser);

export default userRouter;
