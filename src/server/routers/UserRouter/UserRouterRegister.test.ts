import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDb from "../../../database/connectDb";
import app from "../../app";
import User from "../../../database/models/User";

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
  const registerdata = {
    username: "xavi",
    password: "12345",
    email: "xav@i.com",
  };
  describe("When it receives a request with username 'xavi' and password '12345' and email 'xav@i,com'", () => {
    test("Then it should respond with a 201 and the new user 'xavi'", async () => {
      const response = await request(app)
        .post("/users/register")
        .send(registerdata)
        .expect(201);

      expect(response.body).toHaveProperty("user");
    });
  });

  describe("When it receives a request with username 'xavi' and password '12345' and email 'xav@i.com' that is already registered", () => {
    test("Then it should respond with a 500 and a 'Error creating a new user", async () => {
      const expectedMessage = "Error creating a new user";

      await User.create(registerdata);

      const response = await request(app)
        .post("/users/register")
        .send(registerdata)
        .expect(500);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});
