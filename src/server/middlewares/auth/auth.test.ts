import type { NextFunction, Request } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError";
import type { CustomRequest } from "../../controllers/sessionControllers/types";
import auth from "./auth";

const next: NextFunction = jest.fn();
const req: Partial<Request> = {};
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNmMyMDIzZDc2OWE1ZWExYzNiNWFlNyIsInVzZXJuYW1lIjoieGF2aSIsImlhdCI6MTY2ODA5ODE0MywiZXhwIjoxNjY4MjcwOTQzfQ.52z0Ix11bppcZIjpxi4NN1-UBjNaJM9GRaM9dBnACyE";

describe("Given an auth middleware", () => {
  const expectedError = new CustomError(
    "Authorization header missing",
    "Missing token",
    401
  );
  describe("When it receives a request with no Authorization in its header", () => {
    test("Then it should invoke next with status code 401 and 'Missing token' in its public message", () => {
      req.header = jest.fn();

      auth(req as CustomRequest, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with an Authorization that starts with vearer in its header", () => {
    test("Then it should invoke next with status code 401 and 'Missing token' in its public message", () => {
      req.header = jest.fn().mockReturnValueOnce(`Vearer ${token}`);

      auth(req as CustomRequest, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with an Authorization header with '12345'", () => {
    test("Then it should invoke next with status code 401 and 'Missing token' in its public message", () => {
      req.header = jest.fn().mockReturnValueOnce("12345");

      auth(req as CustomRequest, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with an Authorization header with 'Bearer ' followed by a token", () => {
    test("Then it should add the decoded user id to the request and call next", () => {
      req.header = jest.fn().mockReturnValueOnce(`Bearer ${token}`);

      const userId = new mongoose.Types.ObjectId();

      jwt.verify = jest.fn().mockReturnValueOnce({ id: userId });

      auth(req as CustomRequest, null, next);

      expect(req).toHaveProperty("userId", userId);
      expect(next).toHaveBeenCalled();
    });
  });
});
