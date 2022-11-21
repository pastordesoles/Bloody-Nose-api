import dotenv from "dotenv";

dotenv.config();

interface Environment {
  port: number;
  debug: string;
}

const { PORT: port, DEBUG: debug } = process.env;

// eslint-disable-next-line no-implicit-coercion
export const environment: Environment = { port: +port, debug };
