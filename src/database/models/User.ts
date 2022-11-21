import { Schema, model } from "mongoose";
import type { InferSchemaType } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  picture: {
    type: String,
  },
  supabasePicture: {
    type: String,
  },
  preferredStyles: {
    type: String,
  },
  biography: {
    type: String,
  },
  experience: {
    type: String,
  },
  location: {
    type: String,
  },
});

export type UserStructure = InferSchemaType<typeof userSchema>;

const User = model("User", userSchema, "users");

export default User;
