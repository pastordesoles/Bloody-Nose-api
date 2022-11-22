/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/**/*.test.ts", "!src/**/index.ts"],
  resolver: "jest-ts-webcompat-resolver",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts",
    "!src/loadEnvironment.ts",
    "!src/**/index.ts",
    "!src/app.ts",
    "!src/server/startServer.ts",
    "!src/database/connectDb.ts",
  ],
};
