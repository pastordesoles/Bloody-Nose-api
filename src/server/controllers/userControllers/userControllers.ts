import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import type { RegisterData } from "./types";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, username } = req.body as RegisterData;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.status(201).json({ user: { id: newUser._id, username, email } });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      "Error creating a new user",
      500
    );
    next(customError);
  }
};
