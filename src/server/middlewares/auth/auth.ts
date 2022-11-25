import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError.js";
import { environment } from "../../../loadEnvironment.js";
import type { CustomRequest } from "../../controllers/sessionControllers/types";
import type UserTokenPayload from "./types.js";

const { jwt: jwtSecret } = environment;

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
      const error = new CustomError(
        "Authorization header missing",
        "Missing token",
        401
      );

      next(error);
      return;
    }

    if (!authorizationHeader.startsWith("Bearer ")) {
      const error = new CustomError(
        "Missing bearer in Authorization header",
        "Missing token",
        401
      );

      next(error);
    }

    const token = authorizationHeader.replace(/^Bearer\s*/, "");

    const user = jwt.verify(token, jwtSecret) as UserTokenPayload;

    req.userId = user.id;

    next();
  } catch (error: unknown) {
    const tokenError = new CustomError(
      (error as Error).message,
      "Invalid token",
      401
    );
    next(tokenError);
  }
};

export default auth;
