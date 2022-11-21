import CustomError from "./CustomError";

describe("Given the class CustomError", () => {
  describe("When it is instantiated with message 'Connection error', statusCode 500 and public message 'It seems we have an issue here'", () => {
    test("Then it should return an instace of Error with the received properties", () => {
      const expectedError = {
        message: "Connection error",
        statusCode: 500,
        publicMessage: "It seems we have an issue here",
      };

      const newCustomError = new CustomError(
        expectedError.message,
        expectedError.publicMessage,
        expectedError.statusCode
      );

      expect(newCustomError).toHaveProperty("message", expectedError.message);
      expect(newCustomError).toHaveProperty(
        "publicMessage",
        expectedError.publicMessage
      );
      expect(newCustomError).toHaveProperty(
        "statusCode",
        expectedError.statusCode
      );

      expect(newCustomError).toBeInstanceOf(Error);
    });
  });
});
