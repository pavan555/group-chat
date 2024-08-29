import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { InvalidDataError } from "../errors/custom-error";
import ERRORS from "../config/custom-error-names";
import { SESSION_TIME_OUT } from "../config/variable";

const R = require("ramda");

const DELETE_TOKEN_KEYS = ["exp", "iat"];

export const generateToken = async (
  payload,
  subject,
  expiresIn,
  secret,
  algorithm
) => {
  expiresIn = Number(expiresIn || SESSION_TIME_OUT);
  secret = secret || process.env.JWT_SECRET;
  algorithm = algorithm || process.env.JWT_ALGORITHM;
  payload = R.omit(DELETE_TOKEN_KEYS, payload || {});
  payload.sub = subject || payload.sub;

  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn, algorithm }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

export const parseToken = (token, secret, algorithm) => {
  secret = secret || process.env.JWT_SECRET;
  algorithm = algorithm || process.env.JWT_ALGORITHM;

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, { algorithm }, (err, payload) => {
      if (err) {
        let error = err;
        if (err instanceof TokenExpiredError) {
          error = new TokenExpiredError(
            ERRORS.TOKEN_EXPIRED,
            "Token is expired",
            null,
            STATUS_CODES.BAD_REQUEST
          );
        } else if (err instanceof JsonWebTokenError) {
          error = new InvalidDataError("Malformed token");
        } else if (err instanceof NotBeforeError) {
          error = new InvalidDataError(
            "Token is not valid yet, please wait for active time for the token"
          );
        }
        reject(error);
      }

      payload = R.omit(DELETE_TOKEN_KEYS, payload);
      resolve(payload);
    });
  });
};
