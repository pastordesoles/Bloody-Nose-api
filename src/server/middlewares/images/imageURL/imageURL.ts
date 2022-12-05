import type { NextFunction, Response, Request } from "express";
import { bucket } from "../imageBackup/imageBackup.js";

export const getSessionImage = async (
  req: Request,
  res: Response,

  next: NextFunction
) => {
  const { originalUrl } = req;

  if (!originalUrl.startsWith("/assets")) {
    next();
    return;
  }

  const [, , imageName] = originalUrl.split("/");

  const {
    data: { publicUrl },
  } = bucket.getPublicUrl(imageName);

  res.redirect(publicUrl);
};
