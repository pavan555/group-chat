import { getUserIdFromContext } from "../middlewares/context";
import {
  deleteReactionForMessage,
  getMessagesInGroup,
  reactToMessage,
  sendMessageInGroup,
} from "../services/chatService";

const { Router } = require("express");
const messagesRouter = new Router({ mergeParams: true });


messagesRouter.get("/", (req, res, next) => {
  const groupId = req.params.groupId;
  const userId = getUserIdFromContext();
  return getMessagesInGroup(groupId, userId)
    .then((messages) => res.json(messages))
    .catch(next);
});

messagesRouter.post("/", (req, res, next) => {
  const groupId = req.params.groupId;
  const userId = getUserIdFromContext();
  const payload = req.body || {};
  const message = payload.message || "";
  return sendMessageInGroup(groupId, userId, message)
    .then((result) => res.json(result))
    .catch(next);
});

messagesRouter.post("/:messageId/like", (req, res, next) => {
  const groupId = req.params.groupId;
  const messageId = req.params.messageId;
  const userId = getUserIdFromContext();
  return reactToMessage(groupId, userId, messageId)
    .then((resp) => res.json(resp))
    .catch(next);
});

messagesRouter.post("/:messageId/dislike", (req, res, next) => {
  const groupId = req.params.groupId;
  const messageId = req.params.messageId;
  const userId = getUserIdFromContext();
  return deleteReactionForMessage(groupId, userId, messageId)
    .then((resp) => res.json(resp))
    .catch(next);
});

export default messagesRouter;
