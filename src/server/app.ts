import cors from "cors";
import express from "express";
import morgan from "morgan";
import corsOptions from "./cors/corsOptions.js";

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.disable("x-powered-by");

app.use((req, res) => {
  res.status(200).json({ message: "Build in progress" });
});

export default app;
