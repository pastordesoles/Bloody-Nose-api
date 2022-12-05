import type { NextFunction, Response } from "express";
import fs from "fs/promises";
import path from "path";
import type { SessionStructure } from "../../../../database/models/Session.js";
import { environment } from "../../../../loadEnvironment.js";
import type { CustomRequest } from "../../../controllers/sessionControllers/types";

const { uploadPath } = environment;

const imageRename = async (
  req: CustomRequest<
    Record<string, unknown>,
    Record<string, unknown>,
    SessionStructure
  >,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    next();
    return;
  }

  const timeStamp = Date.now();

  const fileExtension = path.extname(req.file.originalname);
  const fileBaseName = path.basename(req.file.originalname, fileExtension);
  const newFileName = `${fileBaseName}-${timeStamp}${fileExtension}`;
  const newFilePath = path.join(uploadPath, newFileName);

  try {
    await fs.rename(path.join(uploadPath, req.file.filename), newFilePath);

    req.file.filename = newFileName;

    next();
  } catch (error: unknown) {
    next(error);
  }
};

export default imageRename;
