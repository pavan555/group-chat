import ERRORS from "../config/custom-error-names";
import STATUS_CODES from "../config/status-codes";

export class BaseError extends Error {
  constructor(statusCode, code, description, payload, error) {
    super();
    this.name = code;
    this.statusCode = statusCode;
    this.message = description;
    this.payload = payload;

    if (error?.stack) this.stack = error.stack;
  }
}

export class NotFoundError extends BaseError {
  constructor(description = "", errorCode = ERRORS.NOT_FOUND) {
    super(STATUS_CODES.NOT_FOUND, errorCode, description);
  }
}
export class ConfigurationError extends BaseError {
  constructor(description = "", payload = {}) {
    super(
      STATUS_CODES.UNPROCESSABLE_ENTITY,
      ERRORS.CONFIGURATION_ERROR,
      description,
      payload
    );
  }
}

export class TokensExpiredError extends BaseError {
  constructor(
    errorCode,
    description = "",
    payload = {},
    statusCode = STATUS_CODES.BAD_GATEWAY
  ) {
    super(statusCode, errorCode, description, payload);
  }
}

export class InvalidDataError extends BaseError {
  constructor(description = "", payload = {}, errorCode = ERRORS.INVALID_DATA) {
    super(STATUS_CODES.BAD_REQUEST, errorCode, description, payload);
  }
}

export class InvalidUserNameOrPasswordError extends BaseError {
  constructor(description = "", payload) {
    super(
      STATUS_CODES.BAD_REQUEST,
      ERRORS.INVALID_USER_NAME_PASSWORD,
      description,
      payload
    );
  }
}

export class UnAuthorizedError extends BaseError {
  constructor(description, payload) {
    super(
      STATUS_CODES.UNAUTHORIZED,
      ERRORS.INVALID_SESSION,
      description,
      payload
    );
  }
}

export class TokenExpiredError extends BaseError {
  constructor(
    errorCode,
    description = "",
    payload = {},
    statusCode = STATUS_CODES.BAD_GATEWAY
  ) {
    super(statusCode, errorCode, description, payload);
  }
}
