import type { Request } from "express";
import type * as core from "express-serve-static-core";
import type { SessionStructure } from "../../../database/models/Session";

export interface CustomRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any
> extends Request<P, ResBody, ReqBody> {
  userId: string;
}

export interface SessionStructureWithId extends SessionStructure {
  _id: string;
}
