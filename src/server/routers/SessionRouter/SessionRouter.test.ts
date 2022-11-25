import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import request from "supertest";
import mongoose from "mongoose";
import connectDb from "../../../database/connectDb";
import Session from "../../../database/models/Session";
import routes from "../routes";
import { getRandomSessionsList } from "../../../factories/sessionsFactory";
import app from "../../app";
import User from "../../../database/models/User";
import { getRandomUser } from "../../../factories/usersFactory";
import { environment } from "../../../loadEnvironment";

const { sessionsEndpoint, list } = routes;
const { jwt: jwtSecret } = environment;
const sessionEndpoint = `${sessionsEndpoint}${list}`;

let server: MongoMemoryServer;

const sessionsList = getRandomSessionsList(10);

const user = getRandomUser();
const requestUserToken = jwt.sign(
  { username: user.username, id: user._id.toString() },
  jwtSecret
);

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDb(server.getUri());
  await User.create(user);
});

afterEach(async () => {
  await Session.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.disconnect();
  await server.stop();
});

describe("Given a GET /sessions/list endpoint", () => {
  describe("When it receives a request with valid token and there are 10 sessions in the database", () => {
    test("Then it should respond with a list of 10 sessions and status 200", async () => {
      const expectedStatus = 200;

      await Session.create(sessionsList);

      const response = await request(app)
        .get(sessionEndpoint)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("sessions");
      expect(response.body.sessions.sessions).toHaveLength(10);
    });
  });

  describe("When it receives a request with an invalid token and there are 10 sessions in the database", () => {
    test("Then it should respond with a 401 status and an error", async () => {
      const expectedStatus = 401;

      const response = await request(app)
        .get(sessionEndpoint)
        .set("Authorization", "Bearer ")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("When it receives a request with valid token and there are 0 sessions in the database", () => {
    test("Then it should respond with an error and status 404", async () => {
      const expectedStatus = 404;

      const response = await request(app)
        .get(sessionEndpoint)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("When it receives a request with valid token from a non-allowed origin", () => {
    test("Then it should respond with an error and status 500", async () => {
      const expectedStatus = 500;

      const response = await request(app)
        .get(sessionEndpoint)
        .set("Origin", "http://allowed.com")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error");
    });
  });
});
