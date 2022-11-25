import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import Session from "../../../database/models/Session.js";
import type { CustomRequest } from "./types";

export const getAllSessions = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let sessions;

  const pageOptions = {
    // eslint-disable-next-line no-implicit-coercion
    page: +req.query.page || 0,
    limit: 10,
  };

  const countSessions: number = await Session.countDocuments();

  const checkPages = {
    isPreviousPage: pageOptions.page !== 0,
    isNextPage: countSessions >= pageOptions.limit * (pageOptions.page + 1),
    totalPages: Math.ceil(countSessions / pageOptions.limit),
  };

  try {
    sessions = await Session.find()
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit);

    if (sessions.length === 0) {
      const error = new CustomError(
        "No sessions registered",
        "No available sessions yet",
        404
      );
      next(error);
      return;
    }
  } catch (error: unknown) {
    const mongooseError = new CustomError(
      (error as Error).message,
      "Can't retrieve available sessions",
      404
    );
    next(mongooseError);
    return;
  }

  res.status(200).json({ sessions: { ...checkPages, sessions } });
};
