import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError.js";
import { environment } from "../../../loadEnvironment.js";
import type { CustomRequest } from "../../controllers/sessionControllers/types";
import type UserTokenPayload from "./types.js";
import errorsMessageSet from "../../../CustomError/errorsMessageSet.js";

const { jwt: jwtSecret } = environment;
const { authorizationMissing, missingBearer, invalidToken, code401 } =
  errorsMessageSet;

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader: string = req.header("Authorization");

    if (!authorizationHeader) {
      next(authorizationMissing);
      return;
    }

    if (!authorizationHeader.startsWith("Bearer ")) {
      next(missingBearer);
    }

    const token: string = authorizationHeader.replace(/^Bearer\s*/, "");

    const user = jwt.verify(token, jwtSecret) as UserTokenPayload;

    req.userId = user.id;

    next();
  } catch (error: unknown) {
    const tokenError = new CustomError(
      (error as Error).message,
      invalidToken,
      code401
    );
    next(tokenError);
  }
};

export default auth;
