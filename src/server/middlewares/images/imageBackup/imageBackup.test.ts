import type { NextFunction } from "express";
import fs from "fs/promises";
import { getRandomSession } from "../../../../factories/sessionsFactory";
import type { CustomRequest } from "../../../controllers/sessionControllers/types";
import imageBackup, { bucket } from "./imageBackup";

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: jest.fn().mockResolvedValue(true),
        bucket: {
          getPublicUrl: jest.fn().mockReturnValueOnce({
            data: { publicUrl: "testFileName.webp" },
          }),
        },
      }),
    },
  }),
}));

const fileRequest: Partial<Express.Multer.File> = {
  filename: "testFileName.webp",
  originalname: "testOriginalName.webp",
};

const newSession = getRandomSession();
delete newSession.supabasePicture;

const req: Partial<CustomRequest> = {
  body: newSession,
};

const next = jest.fn() as NextFunction;

beforeEach(async () => {
  await fs.writeFile("assets/testFileName.webp", "testFileName");
  await fs.writeFile("assets/testOriginalName.webp", "testOriginalName");
  await fs.readFile("assets/testFileName.webp");
  await fs.readFile("assets/testOriginalName.webp");
});

afterAll(async () => {
  await fs.unlink("assets/testOriginalName-1111.webp");
  await fs.unlink("assets/testOriginalName.webp");
  jest.clearAllMocks();
});

describe("Given a imageBackup middleware", () => {
  describe("When it's invoked with a request that has a file", () => {
    test("Then it should rename the file, upload it to supabase and call next", async () => {
      req.file = fileRequest as Express.Multer.File;

      bucket.getPublicUrl = jest.fn().mockReturnValueOnce({
        data: { publicUrl: "testFileName.webp" },
      });
      await imageBackup(req as CustomRequest, null, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it's invoked with a request that doesn't have a file", () => {
    test("Then it should call next", async () => {
      const emptyReq: Partial<CustomRequest> = {};

      await imageBackup(emptyReq as CustomRequest, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it's invoked with an invalid request", () => {
    test("Then it should call next", async () => {
      req.file = fileRequest as Express.Multer.File;

      await imageBackup(req as CustomRequest, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
