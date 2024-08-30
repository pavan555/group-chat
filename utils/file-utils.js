import { promises as fsp, createReadStream, lstat } from "fs";
import path from "path";

export const readFile = async (filePath, encoding = null) => {
  console.info(
    "readFile triggered for filePath:",
    filePath,
    "with encoding:",
    encoding
  );
  return fsp.readFile(path.resolve(filePath), encoding);
};

export const readFileAsString = async (filePath) => {
  console.info("readFileAsString triggered for filePath:", filePath);
  return readFile(filePath, "utf8");
};

export const readJsonFileAsObject = async (filePath) => {
  console.log("readJsonFileAsObject triggered for filePath:", filePath);
  const fileData = await readFileAsString(filePath);
  return JSON.parse(fileData);
};
