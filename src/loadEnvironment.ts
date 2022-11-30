import dotenv from "dotenv";

dotenv.config();

interface Environment {
  port: number;
  debug: string;
  uri: string;
  jwt: string;
  supabaseUrl: string;
  supabaseKey: string;
  supabaseBucket: string;
  uploadPath: string;
}

const {
  PORT: port,
  DEBUG: debug,
  MONGODB_URL: uri,
  JWT_SECRET: jwt,
  SUPABASE_URL: supabaseUrl,
  SUPABASE_KEY: supabaseKey,
  SUPABASE_BUCKET: supabaseBucket,
  UPLOAD_PATH: uploadPath,
} = process.env;

export const environment: Environment = {
  // eslint-disable-next-line no-implicit-coercion
  port: +port,
  debug,
  uri,
  jwt,
  supabaseBucket,
  supabaseKey,
  supabaseUrl,
  uploadPath,
};
