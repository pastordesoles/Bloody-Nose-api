import type { NextFunction, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import type { SessionStructure } from "../../../../database/models/Session.js";
import type { CustomRequest } from "../../../controllers/sessionControllers/types";
import { environment } from "../../../../loadEnvironment.js";

const { supabaseBucket, supabaseKey, supabaseUrl } = environment;

const supaBase = createClient(supabaseUrl, supabaseKey);

export const bucket = supaBase.storage.from(supabaseBucket);

const imageBackup = async (
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

  const timeStamp = "1111";

  const fileExtension = path.extname(req.file.originalname);
  const fileBaseName = path.basename(req.file.originalname, fileExtension);
  const newFileName = `${fileBaseName}-${timeStamp}${fileExtension}`;
  const newFilePath = path.join("assets", newFileName);

  try {
    await fs.rename(path.join("assets", req.file.filename), newFilePath);
    const fileContent = await fs.readFile(newFilePath);

    await bucket.upload(req.file.filename, fileContent);

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(req.file.filename);

    req.body.picture = newFilePath;
    req.body.supabasePicture = publicUrl;

    next();
  } catch (error: unknown) {
    next(error);
  }
};

export default imageBackup;
