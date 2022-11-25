import type { NextFunction, Response } from "express";
import Session from "../../../database/models/Session";
import { getRandomSessionsList } from "../../../factories/sessionsFactory";
import { getAllSessions } from "./sessionControllers";
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
    test("Then it should invoke response's method status with 200", async () => {
      const expectedStatus = 200;

      Session.countDocuments = jest.fn().mockResolvedValue(10);

      Session.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue(sessionsList),
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
});
