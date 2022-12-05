import type { NextFunction } from "express";
import fs from "fs/promises";
import { getRandomSession } from "../../../../factories/sessionsFactory";
import { environment } from "../../../../loadEnvironment";
import type { CustomRequest } from "../../../controllers/sessionControllers/types";
import imageResize from "./imageResize";

const { uploadPath } = environment;

const newSession = getRandomSession();

let mockToFile = jest.fn();

jest.mock("sharp", () => () => ({
  resize: jest.fn().mockReturnValue({
    webp: jest.fn().mockReturnValue({
      toFormat: jest.fn().mockReturnValue({
        toFile: mockToFile,
      }),
    }),
  }),
}));

const file: Partial<Express.Multer.File> = {
  filename: "test",
  originalname: "testjpg",
};

const req: Partial<CustomRequest> = {
  body: newSession,
};

const next = jest.fn() as NextFunction;

beforeAll(async () => {
  await fs.writeFile(`${uploadPath}/randomsession`, "randomsession");
});

afterAll(async () => {
  await fs.unlink(`${uploadPath}/randomsession`);
});

describe("Given the imageResize middleware", () => {
  describe("When it's instantiated with a valid image", () => {
    test("Then it should call next", async () => {
      const expectedFilename = "test";
      req.file = file as Express.Multer.File;

      await imageResize(req as CustomRequest, null, next);

      expect(req.file.filename).toBe(expectedFilename);
    });
  });

  describe("When it's instantiated with an invalid image", () => {
    test("Then it should call next", async () => {
      jest.clearAllMocks();
      jest.restoreAllMocks();

      mockToFile = jest.fn().mockRejectedValue(new Error());

      await imageResize(req as CustomRequest, null, next);

      expect(next).toBeCalled();
    });
  });

  describe("When it's instantiated withouth an image", () => {
    test("Then it should call next", async () => {
      const request: Partial<CustomRequest> = {
        body: newSession,
      };

      await imageResize(request as CustomRequest, null, next);

      expect(next).toBeCalled();
    });
  });
});
