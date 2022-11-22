import type { NextFunction, Request, Response } from "express";
import type { Credentials } from "./types";
import User from "../../../database/models/User.js";
import { registerUser } from "./userControllers";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a register controller", () => {
  const registerBody: Credentials = {
    username: "xavi",
    password: "12345",
  };

  describe("When it receives a username 'xavi' and a password '12345' and the creation gets rejected", () => {
    test("Then it should invoke its method next", async () => {
      const req: Partial<Request> = {
        body: registerBody,
      };

      User.create = jest.fn().mockRejectedValueOnce(new Error(""));

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a username 'xavi' and a password '12345'", () => {
    test("Then it should invoke its method status with 201 and its method json with the received user id and the username", async () => {
      const expectedStatus = 201;

      const req: Partial<Request> = {
        body: registerBody,
      };

      User.create = jest.fn().mockResolvedValueOnce(registerBody);

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalled();
    });
  });
});
