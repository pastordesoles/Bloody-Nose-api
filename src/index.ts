import { environment } from "./loadEnvironment.js";
import debugConfig from "debug";
import chalk from "chalk";
import startServer from "./server/startServer.js";
import app from "./server/app.js";

const debug = debugConfig("bloody-nose:root");

const { port } = environment;

try {
  await startServer(app, port);
  debug(
    chalk.green.bold(`Server up and listening on http://localhost:${port}`)
  );
} catch (error: unknown) {
  debug(
    chalk.red.bold(
      `There was an error starting the server: ${(error as Error).message}`
    )
  );
}
