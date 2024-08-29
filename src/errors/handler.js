import STATUS_CODES from "../config/status-codes";
import { BaseError } from "./custom-error";

const errors = require("debug")("errors");

export const logErrors = (err, req, res, next) => {
  errors("error is", err.stack);
  next(err);
};

export const clientErrorHandler = (err, req, res, next) => {
  if (err instanceof BaseError) {
    errors("custom error is", err);
    return res.status(err.statusCode).json(err);
  } else {
    return next(err);
  }
};

export const commonErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    console.info("Headers already sent");
    return next(err);
  }
  return res
    .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
    .json({ error: err.stack });
};
