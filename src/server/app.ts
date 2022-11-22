import cors from "cors";
import express from "express";
import morgan from "morgan";
import corsOptions from "./cors/corsOptions.js";
import { generalError, notFoundError } from "./middlewares/errors/errors.js";
import userRouter from "./routers/UserRouter/UserRouter.js";

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.disable("x-powered-by");

app.use("/users", userRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
