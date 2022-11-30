import type { NextFunction, Response } from "express";
import path from "path";
import sharp from "sharp";
import CustomError from "../../../../CustomError/CustomError.js";
import type { CustomRequest } from "../../../controllers/sessionControllers/types";

const imageResize = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { filename } = req.file;

  try {
    await sharp(path.join("assets", filename))
      .resize(320, 180, { fit: "cover" })
      .webp({ quality: 90 })
      .toFormat("webp")
      .toFile(path.join("assets", `${filename}.webp`));

    req.body.picture = `${filename}.webp`;

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
