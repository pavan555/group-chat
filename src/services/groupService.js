import Group from "../db/models/group";
import Message from "../db/models/message";
import {
  InvalidDataError,
  NotFoundError,
  UnAuthorizedError,
} from "../errors/custom-error";
import { newUUID } from "../utils/generic-utils";
import {
  deleteMultipleByQuery,
  deleteOneById,
  existsByQuery,
  findAllByQuery,
  findById,
  findOneAndUpdate,
  findOneByQuery,
  insertOne,
} from "../utils/mongoose-utils";
import {
  existsUserByEmailIdOrThrowError,
  getUserDetails,
  getUsersDetailsByEmails,
} from "./user-service";
const R = require("ramda");

export const getCreatedGroups = async (userId) => {
  await existsUserByEmailIdOrThrowError(userId);
  return findAllByQuery(Group, { createdBy: userId });
};

export const getGroupsForUser = async (userId) => {
  await existsUserByEmailIdOrThrowError(userId);
  return findAllByQuery(
    Group,
    {
      $or: [{ createdBy: userId }, { members: userId }],
    },
    { name: 1, description: 1 }
  );
};

const getMembersForGroup = async (groupId, userId) => {
  await existsUserByEmailIdOrThrowError(userId);
  await existsGroupForUser(groupId, userId);

  let usersForGroup = await findOneByQuery(
    Group,
    { _id: groupId },
    { members: 1, createdBy: 1 }
  );
  return usersForGroup;
};

export const getMembersInGroup = async (groupId, userId, searchText) => {
  let { members, createdBy } = await getMembersForGroup(groupId, userId);
  members = R.append(createdBy, members);
  let searchQuery = {};
  if (!R.isEmpty(searchText)) {
    searchQuery = {
      name: { $regex: searchText, $options: "i" },
      emailId: { $regex: searchText, $options: "i" },
    };
  }
  return getUsersDetailsByEmails(members, searchQuery);
};

const existGroupByQuery = (query = {}) => existsByQuery(Group, query);

const existingGroupOrThrowError = async (query) => {
  const existingGroup = await existGroupByQuery(query);
  if (existingGroup) {
    throw new InvalidDataError("please provide valid details");
  }
  return true;
};

export const existsGroupForUser = async (groupId, userId) => {
  await existsUserByEmailIdOrThrowError(userId);
  const accessQuery = {
    $or: [{ createdBy: userId }, { members: userId }],
    _id: groupId,
  };
  const hasAccessToGroup = await existGroupByQuery(accessQuery);
  if (!hasAccessToGroup) {
    throw new UnAuthorizedError("You do not have access to this group");
  }
  return hasAccessToGroup;
};

export const validateAndReturnGroupName = async (
  userId,
  groupName,
  throwError = true
) => {
  await existsUserByEmailIdOrThrowError(userId);
  if (throwError && R.isEmpty(groupName || "")) {
    throw new InvalidDataError("Please provide a valid group name");
  }
  groupName = R.trim(R.toLower(groupName));
  await existingGroupOrThrowError({ name: groupName });
  return groupName;
};

export const createGroup = async (userId, groupName) => {
  groupName = await validateAndReturnGroupName(userId, groupName);
  const group = { name: groupName, createdBy: userId };
  return insertOne(Group, group);
};

export const updateGroupData = async (
  userId,
  groupId,
  groupDataObject = {}
) => {
  let groupName = groupDataObject.name || "";
  groupName = await validateAndReturnGroupName(userId, groupName, false);
  groupDataObject = R.pick(["name", "description"], {
    name: groupName,
    ...(groupDataObject || {}),
  });
  if (R.isEmpty(groupDataObject)) {
    throw new InvalidDataError("Please provide valid update details");
  }
  const exists = await existGroupByQuery({ _id: groupId, createdBy: userId });
  if (!exists) {
    throw new NotFoundError(`group with id ${groupId} not found`);
  }

  return findOneAndUpdate(Group, { _id: groupId }, groupDataObject);
};

export const deleteGroup = async (userId, groupId) => {
  await existsUserByEmailIdOrThrowError(userId);
  const exists = await existGroupByQuery({ _id: groupId, createdBy: userId });
  if (!exists) {
    throw new UnAuthorizedError(
      `You do not have access to delete the group ${groupId}`
    );
  }
  const jobs = [
    deleteMultipleByQuery(Message, { groupId }),
    deleteOneById(Group, groupId),
  ];
  const result = await Promise.all(jobs);
  return "OK";
};

export const addMembersToGroup = async (groupId, userId, members = []) => {
  members = R.remove(userId, members);
  if (R.isEmpty(members)) {
    throw new InvalidDataError("Please provide members to add");
  }
  let { members: usersForGroup } = await getMembersForGroup(groupId, userId);
  usersForGroup = R.uniq(R.concat(members, usersForGroup || []));
  return findOneAndUpdate(Group, { _id: groupId }, { members: usersForGroup });
};

export const removeMembersFromGroup = async (groupId, userId, members = []) => {
  members = R.remove(userId, members);
  let { members: usersForGroup, createdBy } = await getMembersForGroup(
    groupId,
    userId
  );
  if (!R.equals(createdBy, userId)) {
    throw new UnAuthorizedError(
      "Only the group creator can remove members from the group"
    );
  }
  usersForGroup = R.difference(usersForGroup || [], members);
  return findOneAndUpdate(Group, { _id: groupId }, { members: usersForGroup });
};
