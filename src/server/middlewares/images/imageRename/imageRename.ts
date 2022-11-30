import type { NextFunction, Response } from "express";
import fs from "fs/promises";
import path from "path";
import type { SessionStructure } from "../../../../database/models/Session.js";
import type { CustomRequest } from "../../../controllers/sessionControllers/types";

const imageRename = async (
  req: CustomRequest<
    Record<string, unknown>,
    Record<string, unknown>,
    SessionStructure
  >,
  res: Response,
  next: NextFunction
) => {
  const timeStamp = Date.now();

  const fileExtension = path.extname(req.file.originalname);
  const fileBaseName = path.basename(req.file.originalname, fileExtension);
  const newFileName = `${fileBaseName}-${timeStamp}${fileExtension}`;
  const newFilePath = path.join("assets", newFileName);

  try {
    await fs.rename(path.join("assets", req.file.filename), newFilePath);

    req.file.filename = newFileName;

    next();
  } catch (error: unknown) {
    next(error);
  }
};

export default imageRename;
