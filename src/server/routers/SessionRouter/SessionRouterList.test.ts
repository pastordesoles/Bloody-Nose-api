import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import request from "supertest";
import mongoose from "mongoose";
import connectDb from "../../../database/connectDb";
import { Session } from "../../../database/models/Session";
import routes from "../routes";
import {
  getRandomSession,
  getRandomSessionsList,
} from "../../../factories/sessionsFactory";
import app from "../../app";
import User from "../../../database/models/User";
import { getRandomUser } from "../../../factories/usersFactory";
import { environment } from "../../../loadEnvironment";

const { sessionsEndpoint, list } = routes;
const { jwt: jwtSecret } = environment;
const sessionEndpoint = `${sessionsEndpoint}${list}`;
const oneSession = `${sessionsEndpoint}/session/`;

let server: MongoMemoryServer;

const sessionsList = getRandomSessionsList(5);

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
        .get(`${sessionEndpoint}?page=0&style=all`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("sessions");
      expect(response.body.sessions.sessions).toHaveLength(5);
    });
  });

  describe("When it receives a request with an invalid token and there are 10 sessions in the database", () => {
    test("Then it should respond with a 401 status and an error", async () => {
      const expectedStatus = 401;

      const response = await request(app)
        .get(sessionEndpoint)
        .set("style", "all")
        .set("Authorization", "Bearer ")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("When it receives a request with valid token and there are 0 sessions in the database", () => {
    test("Then it should respond with an error and status 404", async () => {
      const expectedStatus = 404;

      const response = await request(app)
        .get(`${sessionEndpoint}?page=0&style=all`)
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

describe("Given a GET /sessions/session/:id endpoint", () => {
  describe("When it receives a request with valid token and there are 10 sessions in the database", () => {
    test("Then it should respond with a session and status 200", async () => {
      const expectedStatus = 200;
      const session = sessionsList[0];

      await Session.create(sessionsList);

      const response = await request(app)
        .get(`${oneSession}${session._id}`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("session");
    });
  });

  describe("When it receives a request with with an invalid token and there are 10 sessions in the database", () => {
    test("Then it should respond with a 401 status and an error", async () => {
      const expectedStatus = 401;
      const session = sessionsList[0];

      await Session.create(sessionsList);

      const response = await request(app)
        .get(`${oneSession}${session._id}`)
        .set("Authorization", `Bearer`)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("When it receives a request with valid token and there are 0 sessions in the database", () => {
    test("Then it should respond with a session and status 404", async () => {
      const expectedStatus = 404;
      const session = sessionsList[0];

      const response = await request(app)
        .get(`${oneSession}${session._id}`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error");
    });
  });
});

describe("Given a DELETE /sessions/delete/:id endpoint", () => {
  describe("When it receives a request from a logged user and a valid session id", () => {
    test("Then it should call the response method status with a 200", async () => {
      const expectedStatus = 200;

      const session = getRandomSession();

      const sessionWithOwner = { ...session, owner: user._id };

      const newSession = await Session.create(sessionWithOwner);

      await request(app)
        .delete(`/sessions/delete/${newSession.id as string}`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(expectedStatus);
    });
  });

  describe("When it receives a request from a logged user with an invalid session id '123456'", () => {
    test("Then it should call the response method status with a 500 and an error", async () => {
      const expectedStatus = 500;
      const sessionId = "123456";

      const response = await request(app)
        .delete(`/sessions/delete/${sessionId}`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error");
    });
  });
});
