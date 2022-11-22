import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { RegisterData } from "../server/controllers/userControllers/types";

const userFactory = Factory.define<RegisterData>(() => ({
  username: faker.internet.userName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
}));

const predefinedUser = (user?: RegisterData) =>
  Factory.define<RegisterData>(() => ({
    username: user.username ?? faker.internet.userName(),
    password: user.password ?? faker.internet.password(),
    email: user.email ?? faker.internet.email(),
  }));

export const getPredefinedUser = (user?: RegisterData) => () =>
  predefinedUser(user).build();

export const getRandomUser = () => userFactory.build();

export const getRandomUserList = (number: number) =>
  userFactory.buildList(number);
