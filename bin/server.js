var app = require("../app");
const debugModule = require("debug");
debugModule.enable("http:*,error*,db*");
const debug = debugModule("http:server");

const http = require("http");
const { closeDBConnection } = require("../db/setup");

const normalizePort = (value) => {
  const port = parseInt(value);
  if (isNaN(port)) {
    //named pipe maybe using for sockets/messaging communication
    return value;
  }

  if (port >= 0) return port;

  return false;
};

const port = normalizePort(process.env.PORT || "3000");

app.set("port", port);

const server = http.createServer(app);
server.setTimeout(10 * 60 * 1000);

const onError = (error) => {
  debug("error while listening to server", error);
  if (error.syscall !== "listen") {
    throw error;
  }

  let usageBinding = typeof port === "string" ? "pipe" : "port";
  usageBinding = `${usageBinding} ${port}`;

  switch (error.code) {
    case "EACCES":
      console.error(usageBinding + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(usageBinding + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const address = server.address();
  const usageBinding =
    typeof address === "string" ? `pipe ${address}` : `port ${address.port}`;
  debug(`App server listening on ${usageBinding}`);
};

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

const gracefulShutDown = (signal) => {
  return () => {
    if (server.listening) {
      debug("Closing http server for:", signal);
      server.close(async (err) => {
        if (err) {
          debug(
            "Error while closing server. Force exiting server. Error:",
            err
          );
          return process.exit(1);
        }
        await closeDBConnection(false);
      });
    }
  };
};

process.on("SIGTERM", gracefulShutDown("SIGTERM"));
process.on("SIGINT", gracefulShutDown("SIGINT"));
process.on("SIGQUIT", gracefulShutDown("SIGQUIT"));
