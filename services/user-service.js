import { query } from "jsonpath";
import User from "../db/models/user";
import {
  InvalidDataError,
  NotFoundError,
  UnAuthorizedError,
} from "../errors/custom-error";
import { generateIdForString, newUUID } from "../utils/generic-utils";
import {
  existsByQuery,
  findAllByQuery,
  findById,
  findOneByQuery,
  getNewObjectId,
  insertOne,
  isMongooseObject,
} from "../utils/mongoose-utils";
const R = require("ramda");

export const findUserByEmailAndPassword = (emailId, password) => {
  return findOneByQuery(User, {
    emailId,
    password: generateIdForString(password),
  });
};

export const loginUser = async (emailId, password) => {
  let user = await findUserByEmailAndPassword(emailId, password);
  user = isMongooseObject(user) ? user.toJSON() : user;
  if (!user) {
    throw new UnAuthorizedError("Invalid email/password");
  }
  return user;
};

//used for searching members
export const getAllUsers = () => {
  return findAllByQuery(User, { admin: { $ne: true } });
};

export const getUsersDetailsBySearchText = (searchText) => {
  if (R.isEmpty(searchText || "")) {
    return getAllUsers();
  }
  return findAllByQuery(
    User,
    {
      admin: { $ne: true },
      $or: [
        { name: { $regex: searchText, $options: "i" } },
        { emailId: { $regex: searchText, $options: "i" } },
      ],
    },
    { name: 1, emailId: 1 }
  );
};

export const getUsersDetailsByEmails = (emailIds, searchQuery = {}) => {
  emailIds = Array.isArray(emailIds)
    ? R.filter((id) => id, emailIds)
    : emailIds;

  let query = {
    admin: { $ne: true },
    emailId: { $in: emailIds },
  };

  query = R.mergeLeft(searchQuery, query);

  return findAllByQuery(User, query);
};

export const existsUserByEmailId = async (emailId) => {
  return existsByQuery(User, { emailId });
};

export const existsUserByEmailIdOrThrowError = async (emailId) => {
  const user = await existsUserByEmailId(emailId);
  if (!user) {
    throw new NotFoundError(`User not found with id ${emailId}`);
  }
  return true;
};

export const createAdminUser = (adminUser) => {
  return insertOne(User, adminUser);
};

export const getUserDetails = async (userId) => {
  const user = await findById(User, userId, { admin: 0 }, "emailId");
  if (!user) {
    throw new NotFoundError(`User not found with id ${userId}`);
  }
  return user;
};

const REQUIRED_FIELDS_IN_USER = ["name", "emailId"];

export const createUserWithPayload = async (userPayload) => {
  const emailId = userPayload.emailId || "";
  const userName = userPayload.name || "";
  const password = userPayload.password || "";

  if (R.isEmpty(emailId)) {
    throw new InvalidDataError("Please provide valid emailId");
  }

  if (R.isEmpty(userName)) {
    throw new InvalidDataError("Please provide valid name");
  }

  if (R.isEmpty(password)) {
    throw new InvalidDataError("Please provide valid password");
  }

  const existingUser = await existsUserByEmailId(emailId);
  if (existingUser) {
    throw new InvalidDataError("please provide valid details");
  }

  userPayload.password = generateIdForString(password);
  const user = R.omit(["_id", "admin"], userPayload);
  //TODO: send email with password after admin creates the user
  //OR need to handle registration according to docs it is not clear
  const createdObject = await insertOne(User, user);
  return R.omit(["password", "__v"], createdObject);
};

export const updateUserInfo = async (userId, updateObject) => {
  updateObject = R.pick(["password", "name"], updateObject);

  if (R.isEmpty(updateObject)) {
    throw new InvalidDataError("Please provide valid update details");
  }
  const existingUser = await existsUserByEmailId(userId);
  if (!existingUser) {
    throw new InvalidDataError(`User not exists for emailId: ${userId}`);
  }
  return findOneAndUpdate(User, { emailId: userId }, updateObject);
};
