import type { NextFunction, Response } from "express";
import Session from "../../../database/models/Session";
import {
  getRandomSession,
  getRandomSessionsList,
} from "../../../factories/sessionsFactory";
import { getAllSessions, getOneSession } from "./sessionControllers";
import type { CustomRequest } from "./types";

afterEach(() => {
  jest.clearAllMocks();
});

const req: Partial<CustomRequest> = {
  userId: "1234",
  params: {},
  query: { page: "0" },
};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

const sessionsList = getRandomSessionsList(1);

describe("Given a getAllSessions controller", () => {
  describe("When it receives a custom request with id '1234'", () => {
    test("Then it should invoke response's method status with 200 and a list of sessions", async () => {
      const expectedStatus = 200;

      Session.countDocuments = jest.fn().mockReturnValue({
        exec: jest.fn().mockReturnValue(10),
      });

      Session.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValue(sessionsList),
          }),
        }),
      });

      await getAllSessions(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toBeCalledWith({
        sessions: {
          isNextPage: true,
          isPreviousPage: false,
          sessions: sessionsList,
          totalPages: 1,
        },
      });
    });
  });

  describe("When it receives a custom request with id '1234' and there is an error getting the list", () => {
    test("Then it should call its method next with a sessions error", async () => {
      Session.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValue(null),
          }),
        }),
      });

      await getAllSessions(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a custom request with id '1234' and there are no available sessions", () => {
    test("Then it should call its method next with a sessions error", async () => {
      Session.countDocuments = jest.fn().mockReturnValue({
        exec: jest.fn().mockReturnValue(0),
      });

      Session.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValue([]),
          }),
        }),
      });

      await getAllSessions(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a getOneSession controller", () => {
  const session = getRandomSession();
  describe("When it receives a request with a valid id session", () => {
    test("Then it should invoke respone's method status with 200 and a session", async () => {
      const params = {
        id: session._id,
      };

      req.params = params;
      const expectedStatus = 200;

      Session.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockReturnValue(session) });

      await getOneSession(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ session });
    });
  });

  describe("When it receives a request with an invalid id session", () => {
    test("Then it should call next with an error", async () => {
      const params = {
        id: session._id,
      };

      req.params = params;
      const error = new Error();

      Session.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockRejectedValue(error) });

      await getOneSession(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a request with an inexsistent id session", () => {
    test("Then it should call next", async () => {
      const params = {
        id: session._id,
      };

      req.params = params;

      Session.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockReturnValue(null) });

      await getOneSession(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});
