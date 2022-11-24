import { Schema, model } from "mongoose";
import type { InferSchemaType } from "mongoose";

const sessionSchema = new Schema({
  picture: {
    type: String,
  },
  supabasePicture: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  participants: {
    type: Number,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

export type SessionStructure = InferSchemaType<typeof sessionSchema>;

const Session = model("Session", sessionSchema, "sessions");

export default Session;
