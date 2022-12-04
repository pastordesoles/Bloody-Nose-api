/* eslint-disable no-implicit-coercion */
import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import type { SessionStructure } from "../../../database/models/Session.js";
import type { CustomRequest } from "./types";
import errorsMessageSet from "../../../CustomError/errorsMessageSet.js";
import { Session } from "../../../database/models/Session.js";
import styles from "./styles.js";

const { noAvailableSessions, cantRetrieveSessions, code404, sessionNotFound } =
  errorsMessageSet;

export const getAllSessions = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let sessionsToAdd;

  const pageOptions = {
    page: +req.query.page || 0,
    limit: 6,
  };

  const countSessions: number = await Session.countDocuments().exec();

  const checkPages = {
    isPreviousPage: pageOptions.page !== 0,
    isNextPage: countSessions >= pageOptions.limit * (pageOptions.page + 1),
    totalPages: Math.ceil(countSessions / pageOptions.limit),
  };

  try {
    sessionsToAdd = await Session.find()
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit)
      .exec();

    if (sessionsToAdd.length === 0) {
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

  const sessions = sessionsToAdd.map((session) => ({
    ...session.toJSON(),
    picture: `${req.protocol}://${req.get("host")}/assets/${session.picture}`,
  }));

  res.status(200).json({ sessions: { ...checkPages, sessions } });
};

export const getOneSession = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id).exec();

    if (!session) {
      next(sessionNotFound);
      return;
    }

    res.status(200).json({
      session: {
        ...session.toJSON(),
        picture: session.picture
          ? `${req.protocol}://${req.get("host")}/assets/${session.picture}`
          : "",
      },
    });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      "Error retrieving session",
      500
    );
    next(customError);
  }
};

export const createOneSession = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const receivedSession = req.body as SessionStructure;

  try {
    const newSession = await Session.create({
      ...receivedSession,
      owner: userId,
    });

    res.status(201).json({
      session: {
        ...newSession.toJSON(),
        picture: newSession.picture,
      },
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteOneSession = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const userIdtoCheck = req.userId;

  try {
    const session = await Session.findById(id).exec();

    if (session.owner.toString() !== userIdtoCheck) {
      const customError = new CustomError(
        "Invalid id's",
        "Error deleting session",
        500
      );
      next(customError);
      return;
    }

    await Session.findByIdAndDelete(id).exec();
    res.status(200).json({ message: "Session has been deleted" });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      "Error deleting session",
      500
    );
    next(customError);
  }
};

export const updateOneSession = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const userIdtoCheck = req.userId;

  const receivedSession = req.body as SessionStructure;

  try {
    const session = await Session.findById(id).exec();
    if (session.owner.toString() !== userIdtoCheck) {
      const customError = new CustomError(
        "Invalid id's",
        "Error updating session",
        500
      );
      next(customError);
      return;
    }

    const updatedSession = await Session.findByIdAndUpdate(
      id,
      { ...receivedSession, owner: userIdtoCheck },
      {
        returnDocument: "after",
      }
    ).exec();

    res.status(201).json({
      session: {
        ...updatedSession,
      },
    });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      "Error updating session",
      500
    );
    next(customError);
  }
};

export const getSessionsByStyle = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let sessionsToAdd;

  const pageOptions = {
    page: +req.query.page || 0,
    limit: 6,
  };

  const { style: styleParam } = req.params;

  const countSessions: number = await Session.countDocuments().exec();

  const checkPages = {
    isPreviousPage: pageOptions.page !== 0,
    isNextPage: countSessions >= pageOptions.limit * (pageOptions.page + 1),
    totalPages: Math.ceil(countSessions / pageOptions.limit),
  };

  try {
    const existStyle = styles.find((style) => style === styleParam);

    if (!existStyle) {
      next(cantRetrieveSessions);
      return;
    }

    const totalSessionsWithStyle = await Session.count({
      style: styleParam,
    }).exec();

    if (totalSessionsWithStyle === 0) {
      next(noAvailableSessions);
      return;
    }

    sessionsToAdd = await Session.find({ style: styleParam })
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit)
      .exec();

    if (sessionsToAdd.length === 0) {
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

  const sessions = sessionsToAdd.map((session) => ({
    ...session.toJSON(),
    picture: `${req.protocol}://${req.get("host")}/assets/${session.picture}`,
  }));

  res.status(200).json({ sessions: { ...checkPages, sessions } });
};
