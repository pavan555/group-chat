import "dotenv/config";
import Mongoose from "mongoose";
import { ConfigurationError } from "../errors/custom-error";
import { insertIfAdminNotAvailable as preSetupData } from "../config/pre-setup-data";

const R = require("ramda");
Mongoose.set("strictQuery", false);

const logger = require("debug")("db");

const dbConnectionUrl = () => process.env.DB_CONNECTION_URL;
const getDbName = () => process.env.DB_NAME;
const getDbUser = () => process.env.DB_USER;
const getDbPassword = () => process.env.DB_PASSWORD;
const dbSslEnabled = () => process.env.DB_SSL_ENABLED;
const dbServerSelectionTimeout = () => process.env.DB_SERVER_SELECTION_TIMEOUT;
const dbMaxPoolSize = () => process.env.DB_MAX_POOL_SIZE;

const getMongoConnectionOptions = () => {
  let options = {
    tls: dbSslEnabled() === "true",
    dbName: getDbName(),
    user: getDbUser(),
    pass: getDbPassword(),
    maxPoolSize: dbMaxPoolSize(),
    serverSelectionTimeoutMS: dbServerSelectionTimeout(),
  };

  return options;
};

export const setup = async () => {
  logger("connecting to db-> " + dbConnectionUrl());
  let options = getMongoConnectionOptions();
  try {
    logger("Connecting to MongoDB with connection options: ");

    await Mongoose.connect(dbConnectionUrl(), options);
    logger("Successfully connected to MongoDB");
    await preSetupData();
  } catch (err) {
    logger("Error while connecting to database: ", dbConnectionUrl(), err);
    throw new ConfigurationError("Error while Connecting to database");
  }
};

export const closeDBConnection = (force = false) =>
  Mongoose.connection.close(force).then((resp) => {
    logger("Database connection closed");
    process.exit(0);
  });

export const dbStatus = () => {
  if (Mongoose.connection.readyState !== 1) {
    logger("Error connecting to DataBase");
    return false;
  } else {
    return true;
  }
};
