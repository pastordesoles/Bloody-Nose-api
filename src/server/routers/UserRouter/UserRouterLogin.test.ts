import request from "supertest";
import connectDb from "../../../database/connectDb";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../../app";
import User from "../../../database/models/User";
import bcrypt from "bcrypt";
import routes from "../routes";

const { login, usersEndpoint } = routes;
const loginEndpoint = `${usersEndpoint}${login}`;

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

describe("Given a POST /users/login endpoint", () => {
  describe("When it receives a request with username 'xavi' and password '12345'", () => {
    test("Then it should respond with a 201 and a valid access token", async () => {
      const password = "12345";
      const hashedPassword = await bcrypt.hash(password, 10);

      const registerdata = {
        username: "xavi",
        password: hashedPassword,
        email: "xav@i.com",
      };

      const logindata = {
        username: "xavi",
        password: "12345",
      };

      await User.create(registerdata);

      const response = await request(app)
        .post(loginEndpoint)
        .send(logindata)
        .expect(200);

      expect(response.body).toHaveProperty("token");
    });
  });

  describe("When it receives a request with username 'xavi' and password '12345' that is not already registered", () => {
    test("Then it should respond with a 500 and a 'Something went wrong' error message", async () => {
      const expectedMessage = "Wrong credentials";

      const logindata = {
        username: "xavi",
        password: "12345",
      };

      const response = await request(app)
        .post(loginEndpoint)
        .send(logindata)
        .expect(401);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });

  describe("When it receives a request with username 'cata' and password '123456' that is not already registered", () => {
    test("Then it should respond with a 500 and a 'Something went wrong' error message", async () => {
      const expectedMessage = "Wrong credentials";

      const logindata = {
        username: "xavi",
        password: "123456",
      };

      const response = await request(app)
        .post(loginEndpoint)
        .send(logindata)
        .expect(401);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});
