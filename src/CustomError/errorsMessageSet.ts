import CustomError from "./CustomError.js";

const errorsMessageSet = {
  notFoundError: new CustomError(
    "Endpoint not found",
    "Endpoint not found",
    404
  ),
};

export default errorsMessageSet;
