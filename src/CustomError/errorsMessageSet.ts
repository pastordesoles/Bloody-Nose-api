import CustomError from "./CustomError.js";

const errorsMessageSet = {
  notFoundError: new CustomError(
    "Endpoint not found",
    "Endpoint not found",
    404
  ),

  wrongCredentialsUsername: new CustomError(
    "Username not found",
    "Wrong credentials",
    401
  ),

  wrongCredentialsPassword: new CustomError(
    "Password is incorrect",
    "Wrong credentials",
    401
  ),

  noAvailableSessions: new CustomError(
    "No sessions registered",
    "No available sessions yet",
    404
  ),

  authorizationMissing: new CustomError(
    "Authorization header missing",
    "Missing token",
    401
  ),

  missingBearer: new CustomError(
    "Missing bearer in Authorization header",
    "Missing token",
    401
  ),

  sessionNotFound: new CustomError(
    "Session not found",
    "Session not found",
    404
  ),

  cantRetrieveSessions: "Can't retrieve available sessions",
  invalidToken: "Invalid token",
  code404: 404,
  code401: 401,
};

export default errorsMessageSet;
