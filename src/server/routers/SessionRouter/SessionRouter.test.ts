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
  await Session.create(sessionsList);
});

afterAll(async () => {
  await Session.deleteMany({});
  await User.deleteMany({});
  await mongoose.disconnect();
  await server.stop();
});

describe("Given a GET /sessions/list endpoint", () => {
  describe("When it receives a request with valid token and there are 10 sessions in the database", () => {
    test("Then it should respond with a list of 10 sessions and status 200", async () => {
      const expectedStatus = 200;

      const response = await request(app)
        .get(sessionEndpoint)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("sessions");
      expect(response.body.sessions.sessions).toHaveLength(10);
    });
  });
});
