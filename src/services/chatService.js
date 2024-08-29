import Group from "../db/models/group";
import Message from "../db/models/message";
import {
  InvalidDataError,
  NotFoundError,
  UnAuthorizedError,
} from "../errors/custom-error";

import {
  deleteOneById,
  existsByQuery,
  findAllByQuery,
  findById,
  findByQueryWithOptions,
  findOneAndUpdate,
  findOneByQuery,
  insertOne,
} from "../utils/mongoose-utils";
import { existsGroupForUser } from "./groupService";

const R = require("ramda");

export const getMessagesInGroup = async (groupId, userId) => {
  await existsGroupForUser(groupId, userId);
  // return last 50 messages in the group
  return findByQueryWithOptions(
    Message,
    { groupId },
    { message: 1, likes: 1, createdBy: 1, createdAt: 1 },
    { createdAt: -1 },
    50,
    0
  );
};

export const sendMessageInGroup = async (groupId, userId, message) => {
  await existsGroupForUser(groupId, userId);
  if (R.isEmpty(message)) {
    throw new InvalidDataError("Message cannot be empty");
  }
  const messageData = { message, createdBy: userId, groupId };
  return insertOne(Message, messageData);
};

const getReactionsForMessage = async (messageId) => {
  const message = await findById(Message, messageId, { likes: 1 });
  if (!message) {
    throw new NotFoundError("Message not found");
  }
  return message.likes || [];
};

export const reactToMessage = async (groupId, userId, messageId) => {
  await existsGroupForUser(groupId, userId);
  let likes = getReactionsForMessage(messageId);
  likes = R.uniq(R.append(userId, likes));
  return findOneAndUpdate(Message, { _id: messageId }, { likes });
};

export const deleteReactionForMessage = async (groupId, userId, messageId) => {
  await existsGroupForUser(groupId, userId);
  let likes = getReactionsForMessage(messageId);
  likes = R.without(userId, likes);
  return findOneAndUpdate(Message, { _id: messageId }, { likes });
};
