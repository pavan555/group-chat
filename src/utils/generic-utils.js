import { v4 as UUIDV4 , v5 as UUIDV5} from "uuid";
import url from "url";
import jsonpath from "jsonpath";

export const newUUID = () => UUIDV4();

export const generateIdForString = (
  string,
  namespace = "1b671a64-40d5-491e-99b0-da01ff1f3341"
) => UUIDV5(string, namespace);


export const getValueForPathOrDefault = (object, path, defaultValue) => {
  return jsonpath.value(object, "$." + path) || defaultValue;
};

export const setValueForPathOrDefault = (object, path, value) => {
  return object && jsonpath.value(object, "$." + path, value);
};

export const getBaseUrlFromRequest = (req) => {
  const urlObject = url.format({
    protocol: req.headers["x-forwarded-proto"] || req.protocol,
    host: req.get("host"),
    port: req.headers["x-forwarded-port"] || req.port,
  });
  return urlObject.toString();
};
