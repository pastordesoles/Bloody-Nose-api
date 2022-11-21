class CustomError extends Error {
  constructor(
    message: string,
    public publicMessage: string,
    public statusCode: number
  ) {
    super(message);
  }
}

export default CustomError;
