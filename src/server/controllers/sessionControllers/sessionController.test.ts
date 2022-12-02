import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import { Session } from "../../../database/models/Session";
import {
  getRandomSession,
  getRandomSessionsList,
} from "../../../factories/sessionsFactory";
import {
  createOneSession,
  deleteOneSession,
  getAllSessions,
  getOneSession,
  updateOneSession,
} from "./sessionControllers";
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
        exec: jest.fn().mockReturnValue(5),
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

describe("Given a createOneSession controller", () => {
  describe("When it receives a request", () => {
    test("Then it should invoke its response with status 201 and the newly created session", async () => {
      const expectedStatus = 201;
      const session = getRandomSession();
      const expectedResponse = { ...session };

      req.body = session;
      req.userId = session.owner.toString();

      Session.create = jest.fn().mockReturnValueOnce({
        ...session,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        toJSON: jest.fn().mockReturnValueOnce(session),
      });

      await createOneSession(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({
        session: expectedResponse,
      });
    });
  });

  describe("When it receives a request and Session create rejects", () => {
    test("Then next should be invoked with an error", async () => {
      const error = new Error();

      Session.create = jest.fn().mockRejectedValue(error);

      await createOneSession(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a deleteOneSession controller", () => {
  const session = getRandomSession();
  describe("When it receives a request with a valid id session", () => {
    test("Then it should invoke respone's method status with 200 and the message 'Session has been deleted'", async () => {
      const params = {
        id: session._id,
      };

      req.params = params;
      req.userId = session.owner.toString();
      const expectedStatus = 200;

      Session.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockReturnValue(session) });

      Session.findByIdAndDelete = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockReturnValue({}) });

      await deleteOneSession(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({
        message: "Session has been deleted",
      });
    });
  });

  describe("When it receives a request with an invalid id session", () => {
    test("Then it should call next with an error", async () => {
      const params = {
        id: session._id,
      };

      req.params = params;
      req.userId = "";
      const error = new CustomError(
        "Invalid id's",
        "Error deleting session",
        500
      );

      Session.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockReturnValue(session) });

      await deleteOneSession(
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
        id: "",
      };

      req.params = params;

      Session.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockReturnValue(null) });

      await deleteOneSession(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given an updateOneSession controller", () => {
  const session = getRandomSession();
  describe("When it receives an id with a valid id session", () => {
    test("Then it should invoke its status method with 201 and the session updated body ", async () => {
      const params = {
        id: session._id,
      };

      req.params = params;
      req.userId = session.owner.toString();
      const expectedStatus = 201;

      Session.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockReturnValue(session) });

      Session.findByIdAndUpdate = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockReturnValue(session) });

      await updateOneSession(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ session: { ...session } });
    });
  });

  describe("When it receives a request with an invalid id session", () => {
    test("Then it should call next with an error", async () => {
      const params = {
        id: session._id,
      };

      req.params = params;
      req.userId = "";
      const error = new CustomError(
        "Invalid id's",
        "Error updating session",
        500
      );

      Session.findByIdAndUpdate = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockReturnValue(session) });

      await updateOneSession(
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
        id: "",
      };

      req.params = params;

      Session.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockReturnValue(null) });

      await updateOneSession(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});
