/* eslint-disable new-cap */
import express from "express";
import routes from "../routes.js";

import {
  getAllSessions,
  getOneSession,
} from "../../controllers/sessionControllers/sessionControllers.js";
import auth from "../../middlewares/auth/auth.js";

const { list, session } = routes;

const sessionRouter = express.Router();

sessionRouter.get(list, auth, getAllSessions);
sessionRouter.get(session, auth, getOneSession);

export default sessionRouter;
