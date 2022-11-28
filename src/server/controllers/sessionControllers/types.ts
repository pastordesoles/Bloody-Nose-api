import type { Request } from "express";
import type { SessionStructure } from "../../../database/models/Session";

export interface CustomRequest extends Request {
  userId: string;
}

export interface SessionStructureWithId extends SessionStructure {
  _id: string;
}
