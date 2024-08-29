export const SESSION_ID_KEY = "sessionId";
export const SESSION_TIME_OUT = 24 * 60 * 60; // 24 hours
export const REGISTER_TOKEN_EXPIRY = 48 * 60 * 60; // 48 hours for registration (admin invites users)
export const RESET_PASSWORD_TOKEN_EXPIRY = 15 * 60; // 15 minutes
export const LOGIN_FINGERPRINT_EXPIRY = 15 * 60; // 15 minutes

export const ACTIONS = {
  RESET_PASSWORD: "RESET_PASSWORD",
  USER_LOGIN: "USER_LOGIN",
};
