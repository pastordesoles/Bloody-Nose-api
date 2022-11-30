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
import { environment } from "../../../loadEnvironment.js";

const { register, login } = routes;
const { uploadPath } = environment;

const upload = multer({
  dest: path.join(uploadPath),
  limits: { fileSize: 1048576 },
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
