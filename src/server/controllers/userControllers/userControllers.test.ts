import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import type { Credentials, RegisterData } from "./types";
import User from "../../../database/models/User.js";
import { loginUser, registerUser } from "./userControllers";
import errorsMessageSet from "../../../CustomError/errorsMessageSet";

const { wrongCredentialsPassword, wrongCredentialsUsername } = errorsMessageSet;

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a register controller", () => {
  const registerBody: RegisterData = {
    username: "xavi",
    password: "12345",
    email: "xav@i.com",
  };

  describe("When it receives a username 'xavi', email 'xav@i.com' and a password '12345' and the creation gets rejected", () => {
    test("Then it should invoke its method next", async () => {
      const req: Partial<Request> = {
        body: registerBody,
      };

      User.create = jest.fn().mockRejectedValueOnce(new Error(""));

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a username 'xavi', email 'xav@i.com' and a password '12345'", () => {
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

describe("Given a login controller", () => {
  const loginBody: Credentials = {
    username: "xavi",
    password: "12345",
  };

  const req: Partial<Request> = {
    body: loginBody,
  };

  describe("When When it receives a  correct username 'xavi' and a correct password '12345'", () => {
    test("Then it should invoke the response method with a 200 status and its json method with a valid token", async () => {
      const expectedStatus = 200;
      User.findOne = jest.fn().mockResolvedValueOnce(loginBody);
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with an invalid username", () => {
    test("Then it should invoke the next function with a username error", async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(null);
      const usernameError = wrongCredentialsUsername;

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toBeCalledWith(usernameError);
    });
  });

  describe("When it receives a valid username 'xavi' and the wrong password", () => {
    test("Then it should invoke the next function with a password error", async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(loginBody);
      const passwordError = wrongCredentialsPassword;

      bcrypt.compare = jest.fn().mockResolvedValueOnce(false);

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toBeCalledWith(passwordError);
    });
  });
});
