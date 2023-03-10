/* eslint-disable new-cap */
import express from "express";
import multer from "multer";
import path from "path";
import { validate } from "express-validation";
import routes from "../routes.js";
import {
  createOneSession,
  deleteOneSession,
  getAllSessions,
  getOneSession,
  updateOneSession,
} from "../../controllers/sessionControllers/sessionControllers.js";
import auth from "../../middlewares/auth/auth.js";
import imageBackup from "../../middlewares/images/imageBackup/imageBackup.js";
import imageResize from "../../middlewares/images/imageResize/imageResize.js";
import sessionSchema from "../../../schemas/sessionSchema.js";
import imageRename from "../../middlewares/images/imageRename/imageRename.js";
import { environment } from "../../../loadEnvironment.js";

const { list, session, createSession, deleteSession, editSession } = routes;
const { uploadPath } = environment;

const sessionRouter = express.Router();

const upload = multer({
  dest: path.join(uploadPath),
  limits: { fileSize: 1048576 },
});

sessionRouter.get(list, auth, getAllSessions);

sessionRouter.get(session, auth, getOneSession);

sessionRouter.post(
  createSession,
  auth,
  upload.single("picture"),
  validate(sessionSchema, {}, { abortEarly: false }),
  imageRename,
  imageResize,
  imageBackup,
  createOneSession
);

sessionRouter.delete(deleteSession, auth, deleteOneSession);

sessionRouter.patch(
  editSession,
  auth,
  upload.single("picture"),
  validate(sessionSchema, {}, { abortEarly: false }),
  imageRename,
  imageResize,
  imageBackup,
  updateOneSession
);

export default sessionRouter;
