import { SESSION_ID_KEY, SESSION_TIME_OUT } from "../config/variable";
import { InvalidDataError, UnAuthorizedError } from "../errors/custom-error";
import { existsUserByEmailId } from "../services/user-service";
import {
  getValueForPathOrDefault,
  setValueForPathOrDefault,
} from "../utils/generic-utils";
import * as JWTUtils from "../utils/jwt-utils";
const debug = require("debug")("authenticator");
const R = require("ramda");
export const BEARER_PREFIX = "Bearer ";

const isValidBearerTokenAuthentication = (request) => {
  return (
    request.headers.authorization === BEARER_PREFIX + process.env.AUTH_TOKEN
  );
};

const validateAdminAuthentication = (req, res, next) => {
  debug("Validating admin authentication");
  let isSessionValid = false;
  if (isValidBearerTokenAuthentication(req)) {
    isSessionValid = true;
  } else if (req.headers["internal-token"] === process.env.AUTH_TOKEN) {
    isSessionValid = true;
  } else {
    isSessionValid = false;
  }
  if (!isSessionValid) {
    return next(new UnAuthorizedError());
  }

  if (req.headers["x-user-id"]) {
    setValueForPathOrDefault(
      req,
      "context.principal.userId",
      req.headers["x-user-id"]
    );
  } else {
    next(new InvalidDataError("Admin emailId is not passed"));
  }
  setValueForPathOrDefault(req, "context.principal.admin", true);
  next();
};

export const authenticate = async function (req, res, next) {
  let token = req.cookies[SESSION_ID_KEY];

  console.log("req", req.headers, req.cookies)
  if (!token) {
    return validateAdminAuthentication(req, res, next);
  }
  try {
    let payload = await JWTUtils.parseToken(token);

    const userExists = await existsUserByEmailId(payload.sub);
    if (!userExists) {
      throw new InvalidUserNameOrPasswordError();
    }
    payload.userId = payload.sub;
    setValueForPathOrDefault(req, "context.principal", payload);
    setValueForPathOrDefault(req, "context.userId", payload.userId);

    return JWTUtils.generateToken(payload).then((newToken) => {
      res.cookie(
        SESSION_ID_KEY,
        newToken,
        cookieOptions({ maxAge: SESSION_TIME_OUT * 1000 })
      );
      next();
    });
  } catch (e) {
    console.error("Error while validating token:", e);
    debug("Error while validating token:", e);
    return next(new UnAuthorizedError());
  }
};

export const cookieOptions = (options) => {
  const secure = process.env.SESSION_COOKIE_SECURE !== "false";
  const defaultOptions = {
    maxAge: SESSION_TIME_OUT * 1000,
    httpOnly: true,
    secure,
    sameSite: "strict",
  };
  return R.mergeLeft(options || {}, defaultOptions);
};

export const permitOnlyAdmin = () => {
  return async (req, res, next) => {
    const isAdmin = getValueForPathOrDefault(
      req,
      "context.principal.admin",
      false
    );
    if (!isAdmin) {
      return next(new UnAuthorizedError());
    }
    next();
  };
};
