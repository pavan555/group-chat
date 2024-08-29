const debug = require("debug")("request");

export const reqLogger = (req, res, next) => {
  debug(
    "Request received with query => ",
    req.query,
    " Params => ",
    req.params,
    " Headers => ",
    req.headers,
    " body=>",
    req.body
  );
  next();
};
