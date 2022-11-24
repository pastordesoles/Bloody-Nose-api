import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../../database/models/User.js";
import type { Credentials, RegisterData } from "./types";
import { environment } from "../../../loadEnvironment.js";
import errorsMessageSet from "../../../CustomError/errorsMessageSet.js";

const { jwt: jwtSecret } = environment;
const { wrongCredentialsPassword, wrongCredentialsUsername } = errorsMessageSet;

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
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as Credentials;

  const user = await User.findOne({ username }).exec();

  if (!user) {
    next(wrongCredentialsUsername);
    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    next(wrongCredentialsPassword);
    return;
  }

  const tokenPayload = {
    id: user._id,
    username,
  };

  const token = jwt.sign(tokenPayload, jwtSecret, {
    expiresIn: "2d",
  });

  res.status(200).json({ token });
};
