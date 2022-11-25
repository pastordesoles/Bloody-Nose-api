import cors from "cors";
import express from "express";
import morgan from "morgan";
import corsOptions from "./cors/corsOptions.js";
import { generalError, notFoundError } from "./middlewares/errors/errors.js";
import userRouter from "./routers/UserRouter/UserRouter.js";
import routes from "./routers/routes.js";
import sessionRouter from "./routers/SessionRouter/SessionRouter.js";

const { usersEndpoint, sessionsEndpoint } = routes;

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.disable("x-powered-by");

app.use(usersEndpoint, userRouter);
app.use(sessionsEndpoint, sessionRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
