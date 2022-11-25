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

  cantRetrieveSessions: "Can't retrieve available sessions",
  code404: 404,
};

export default errorsMessageSet;
