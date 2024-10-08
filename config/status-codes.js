const STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,

  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,

  PERMANENT_REDIRECT: 301,
  TEMPORARY_REDIRECT: 302,
};

export default STATUS_CODES 