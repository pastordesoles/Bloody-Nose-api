import type { Response } from "express";
import CustomError from "../../../CustomError/CustomError";

import { generalError, notFoundError } from "./errors.js";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given a notFoundError middleware", () => {
  describe("When it receives a response'", () => {
    test("Then the status method of the response should be invoked with 404 and the json method with 'Endpoint not found' ", () => {
      const next = jest.fn();

      notFoundError(null, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a generalError middleware", () => {
  describe("When its invoked and it receives", () => {
    const status = 409;
    const message = "The server is burning";
    const publicMessage = "We're going through technical difficulties";
    const newError = new CustomError(message, publicMessage, status);

    describe("an error with status 409", () => {
      test("Then the status method should be invoked with code 409", () => {
        generalError(newError, null, res as Response, null);

        expect(res.status).toHaveBeenCalledWith(status);
      });
    });

    describe("an error with the message 'We're going through technical difficulties'", () => {
      test("Then the json method of the response should be invoked with the message 'We're going through technical difficulties'", () => {
        const expectedResponse = { error: publicMessage };

        generalError(newError, null, res as Response, null);

        expect(res.json).toHaveBeenCalledWith(expectedResponse);
      });
    });

    describe("an error with no status", () => {
      test("Then it should invoke is status method withh 500", () => {
        const expectedStatus = 500;

        const emptyError = new Error(message);

        generalError(emptyError as CustomError, null, res as Response, null);

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
      });
    });

    describe("an error with no public message", () => {
      test("Then it should invoke  its json method with 'Core meltdown'", () => {
        const expectedMessage = { error: "Core meltdown" };

        const emptyError = new Error(message);

        generalError(emptyError as CustomError, null, res as Response, null);

        expect(res.json).toHaveBeenCalledWith(expectedMessage);
      });
    });
  });
});
