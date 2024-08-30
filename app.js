import {
  attachNameSpace,
  createCLSNameSpace,
  getUserIdFromReq,
  setReqContextInfo,
  setUserInfoInContext,
} from "./middlewares/context";
import { reqLogger } from "./middlewares/request-logger";
import logger from "morgan";
import cookieParser from "cookie-parser";
import {
  clientErrorHandler,
  commonErrorHandler,
  logErrors,
} from "./errors/handler";
import { setup } from "./db/setup";
import { authenticate, permitOnlyAdmin } from "./middlewares/authenticator";
import indexRouter from "./routes/indexRouter";
import authRouter from "./routes/authRouter";

import adminRouter from "./routes/admin/adminRouter";
import groupsRouter from "./routes/groupsRouter";
import usersRouter from "./routes/usersRouter";
import { getBaseUrlFromRequest } from "./utils/generic-utils";
import { readJsonFileAsObject } from "./utils/file-utils";

const debug = require("debug")("app");
const express = require("express");
const app = express();

const path = require("path");
const R = require("ramda");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    urls: [
      {
        url: "/public/GroupChat.v1.json",
        name: "Group Chat V1",
      },
    ],
  },
};

setup().catch(() => debug("DB Connection setup Failed"));

logger.token("uid", function (req, res) {
  debug("fetching logger uid");
  debug("fetching logger uid req", req);
  return getUserIdFromReq(req);
});

createCLSNameSpace();
app.use(reqLogger);
app.use(attachNameSpace, setReqContextInfo);

app.use(logger("[:date[iso]] :method :url :status :response-time ms :uid"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "docs")));

app.use("/", indexRouter);

app.get("/api-docs/swagger.json", async (req, res, next) => {
  const swaggerDocument = await readJsonFileAsObject(`./docs/Groupchat.v1.json`);
  const servers = [
    {
      url: `${getBaseUrlFromRequest(req)}`,
      description: "Server Endpoint",
    },
  ];
  const sd = R.assoc("servers", servers, swaggerDocument);
  return res.json(sd);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));

app.use("/auth/:userName", authRouter);

app.use(authenticate);
app.use(attachNameSpace, setUserInfoInContext);
app.use("/admin", permitOnlyAdmin(), adminRouter);
app.use("/groups", groupsRouter);
app.use("/users", usersRouter);

app.use(logErrors);
app.use(clientErrorHandler);
app.use(commonErrorHandler);

export default app;
module.exports = app;

/**
 * If you have app = require("../app"), then just make sure at the bottom of app.js there is: module.exports = app that way when you require it in /bin/www, it actually grabs the code.
 */
