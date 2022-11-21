import { environment } from "./loadEnvironment.js";
import debugConfig from "debug";
import chalk from "chalk";
import startServer from "./server/startServer.js";
import app from "./server/app.js";
import connectDb from "./database/connectDb.js";

const debug = debugConfig("bloody-nose:root");

const { port, uri } = environment;

try {
  await startServer(app, port);
  debug(
    chalk.green.bold(`Server up and listening on http://localhost:${port}`)
  );
  await connectDb(uri);
  debug(chalk.green(`Database connection success`));
} catch (error: unknown) {
  debug(
    chalk.red.bold(
      `There was an error starting the server: ${(error as Error).message}`
    )
  );
}
