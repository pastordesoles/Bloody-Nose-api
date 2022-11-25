import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { SessionStructure } from "../database/models/Session";
import mongoose from "mongoose";

const sessionsFactory = Factory.define<SessionStructure>(() => ({
  content: faker.lorem.paragraph(1),
  date: faker.date.birthdate().toDateString(),
  // eslint-disable-next-line no-implicit-coercion
  length: +faker.random.numeric(2),
  level: faker.random.word(),
  location: faker.address.cityName(),
  material: faker.vehicle.vehicle(),
  // eslint-disable-next-line no-implicit-coercion
  participants: +faker.random.numeric(),
  style: faker.random.word(),
  title: faker.random.word(),
  picture: faker.image.avatar(),
  supabasePicture: faker.image.avatar(),
  owner: new mongoose.Types.ObjectId(),
}));

export const getRandomSession = () => sessionsFactory.build();

export const getRandomSessionsList = (number: number) =>
  sessionsFactory.buildList(number);
