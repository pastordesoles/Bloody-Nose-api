import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import Session from "../../../database/models/Session.js";
import type { CustomRequest } from "./types";
import errorsMessageSet from "../../../CustomError/errorsMessageSet.js";

const { noAvailableSessions, cantRetrieveSessions, code404 } = errorsMessageSet;

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

  const countSessions: number = await Session.countDocuments().exec();

  const checkPages = {
    isPreviousPage: pageOptions.page !== 0,
    isNextPage: countSessions >= pageOptions.limit * (pageOptions.page + 1),
    totalPages: Math.ceil(countSessions / pageOptions.limit),
  };

  try {
    sessions = await Session.find()
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit)
      .exec();

    if (sessions.length === 0) {
      next(noAvailableSessions);
      return;
    }
  } catch (error: unknown) {
    const mongooseError = new CustomError(
      (error as Error).message,
      cantRetrieveSessions,
      code404
    );
    next(mongooseError);
    return;
  }

  res.status(200).json({ sessions: { ...checkPages, sessions } });
};

export const getOneSession = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    res.status(200).json({ session });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      "Error retrieving session",
      500
    );
    next(customError);
  }
};
