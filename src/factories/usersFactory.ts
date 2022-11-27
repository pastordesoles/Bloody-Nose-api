import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { RegisterData } from "../server/controllers/userControllers/types";
import mongoose from "mongoose";

const userFactory = Factory.define<RegisterData>(() => ({
  username: faker.internet.userName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  _id: new mongoose.Types.ObjectId(),
}));

export const getRandomUser = () => userFactory.build();

export const getRandomUserList = (number: number) =>
  userFactory.buildList(number);
