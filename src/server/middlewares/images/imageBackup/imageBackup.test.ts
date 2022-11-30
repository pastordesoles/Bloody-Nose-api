import type { NextFunction } from "express";
import fs from "fs/promises";
import { getRandomSession } from "../../../../factories/sessionsFactory";
import type { CustomRequest } from "../../../controllers/sessionControllers/types";
import imageBackup, { bucket } from "./imageBackup";

const newSession = getRandomSession();
delete newSession.supabasePicture;

const req: Partial<CustomRequest> = {
  body: newSession,
};

const next = jest.fn() as NextFunction;

afterAll(async () => {
  jest.clearAllMocks();
});

describe("Given a imageBackup middleware", () => {
  describe("When it's invoked with a request that has a file", () => {
    test("Then it should rename the file, upload it to supabase and call next", async () => {
      fs.readFile = jest.fn().mockResolvedValueOnce(newSession.picture);

      bucket.upload = jest.fn().mockResolvedValueOnce(undefined);

      bucket.getPublicUrl = jest.fn().mockReturnValueOnce({
        data: { publicUrl: newSession.picture },
      });
      await imageBackup(req as CustomRequest, null, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it's invoked with an invalid request", () => {
    test("Then it should call next", async () => {
      await imageBackup(req as CustomRequest, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
