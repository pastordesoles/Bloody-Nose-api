/* eslint-disable new-cap */
import express from "express";
import multer from "multer";
import path from "path";
import routes from "../routes.js";

import {
  createOneSession,
  getAllSessions,
  getOneSession,
} from "../../controllers/sessionControllers/sessionControllers.js";
import auth from "../../middlewares/auth/auth.js";

const { list, session, createSession } = routes;

const sessionRouter = express.Router();

const upload = multer({
  dest: path.join("assets", "images"),
  limits: { fileSize: 1048576 },
});

sessionRouter.get(list, auth, getAllSessions);
sessionRouter.get(session, auth, getOneSession);
sessionRouter.post(
  createSession,
  auth,
  upload.single("picture"),
  createOneSession
);

export default sessionRouter;
