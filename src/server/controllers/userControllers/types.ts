import type mongoose from "mongoose";

export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterData extends Credentials {
  email: string;
  _id?: mongoose.Types.ObjectId;
}
