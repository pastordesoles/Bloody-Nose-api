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
  const { picture } = req.body;

  try {
    const mainImage = picture;
    const fileContent = await fs.readFile(path.join("assets", mainImage));

    await bucket.upload(mainImage, fileContent);

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(mainImage);

    req.body.supabasePicture = publicUrl;

    next();
  } catch (error: unknown) {
    next(error);
  }
};

export default imageBackup;
