import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDb from "../../../database/connectDb";
import app from "../../app";
import User from "../../../database/models/User";
import routes from "../routes";
import { getPredefinedUser } from "../../../factories/usersFactory";
import type { RegisterData } from "../../controllers/userControllers/types";

const { register, usersEndpoint } = routes;
const registerEndpoint = `${usersEndpoint}${register}`;

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDb(server.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Given a POST /users/register endpoint", () => {
  const registerdata: RegisterData = {
    username: "xavi",
    password: "12345",
    email: "xav@i.com",
  };

  const user = getPredefinedUser(registerdata)();

  describe("When it receives a request with username 'xavi' and password '12345' and email 'xav@i,com'", () => {
    test("Then it should respond with a 201 and the new user 'xavi'", async () => {
      const response = await request(app)
        .post(registerEndpoint)
        .send(user)
        .expect(201);

      expect(response.body).toHaveProperty("user");
    });
  });

  describe("When it receives a request with username 'xavi' and password '12345' and email 'xav@i.com' that is already registered", () => {
    test("Then it should respond with a 500 and a 'Core meltdown", async () => {
      const expectedMessage = "Core meltdown";

      await User.create(registerdata);

      const response = await request(app)
        .post(registerEndpoint)
        .send(user)
        .expect(500);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });

  describe("When it receives an empty request", () => {
    test("Then it should call its status method with code 400 and a 'Core meltdown'", async () => {
      const expectedStatus = 400;
      const expectedMessage = "Core meltdown";

      const response = await request(app)
        .post(registerEndpoint)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});
