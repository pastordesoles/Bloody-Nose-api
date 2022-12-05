import type { NextFunction, Response } from "express";
import path from "path";
import sharp from "sharp";
import CustomError from "../../../../CustomError/CustomError.js";
import { environment } from "../../../../loadEnvironment.js";
import type { CustomRequest } from "../../../controllers/sessionControllers/types";

const { uploadPath } = environment;

const imageResize = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    next();
    return;
  }

  const { filename } = req.file;

  try {
    const fileExtension = path.extname(req.file.filename);

    const fileBaseName = path.basename(req.file.filename, fileExtension);
    const newFileName = `${fileBaseName}`;

    await sharp(path.join(uploadPath, filename))
      .resize(320, 320, { fit: "cover" })
      .webp({ quality: 90 })
      .toFormat("webp")
      .toFile(path.join(uploadPath, `${newFileName}.webp`));

    req.body.picture = `${newFileName}.webp`;

    next();
  } catch (error: unknown) {
    const newError = new CustomError(
      (error as Error).message,
      "Couldn't compress the image",
      500
    );
    next(newError);
  }
};

export default imageResize;
