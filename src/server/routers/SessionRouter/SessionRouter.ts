/* eslint-disable new-cap */
import express from "express";
import routes from "../routes.js";

import { getAllSessions } from "../../controllers/sessionControllers/sessionControllers.js";
import auth from "../../middlewares/auth/auth.js";

const { list } = routes;

const sessionRouter = express.Router();

sessionRouter.get(list, auth, getAllSessions);

export default sessionRouter;
