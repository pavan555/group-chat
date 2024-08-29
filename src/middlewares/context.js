import {
  getBaseUrlFromRequest,
  getValueForPathOrDefault,
  newUUID,
} from "../utils/generic-utils";

const { createNamespace } = require("cls-hooked");

let contextInfo;

const CONTEXT_VARS = {
  USER_ID: "userId",
  REQUEST_ID: "requestId",
  BASE_URI: "baseUri",
};

const getNameSpace = () => process.env.CLS_NAME_SPACE || "REQUEST_CLS_NS";

export const createCLSNameSpace = () => {
  if (!contextInfo) contextInfo = createNamespace(getNameSpace());
};

export const attachNameSpace = (req, res, next) => {
  contextInfo.run(() => next());
};

export const setReqContextInfo = (req, res, next) => {
  const reqId = newUUID();
  contextInfo.set(CONTEXT_VARS.REQUEST_ID, reqId);
  contextInfo.set(CONTEXT_VARS.BASE_URI, getBaseUrlFromRequest(req));
  res.setHeader("x-req-id", reqId);
  next();
};

export const setUserInfoInContext = (req, res, next) => {
  const userId = getValueForPathOrDefault(req, "context.principal.userId");
  contextInfo.set(CONTEXT_VARS.USER_ID, userId);
  next();
};

export const getUserIdFromContext = () => {
  return contextInfo && contextInfo.get(CONTEXT_VARS.USER_ID);
};

export const getUserIdFromReq = (req) =>
  getValueForPathOrDefault(req, "context.principal.userId");

export const getSession = (req) =>
  getValueForPathOrDefault(req, "context.principal");
