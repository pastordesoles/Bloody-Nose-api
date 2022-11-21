import dotenv from "dotenv";

dotenv.config();

interface Environment {
  port: number;
  debug: string;
  uri: string;
}

const { PORT: port, DEBUG: debug, MONGODB_URL: uri } = process.env;

// eslint-disable-next-line no-implicit-coercion
export const environment: Environment = { port: +port, debug, uri };
