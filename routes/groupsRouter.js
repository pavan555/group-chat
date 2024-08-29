import { getUserIdFromContext } from "../middlewares/context";
import {
  addMembersToGroup,
  createGroup,
  deleteGroup,
  getGroupsForUser,
  getMembersInGroup,
  removeMembersFromGroup,
  updateGroupData,
} from "../services/groupService";
import messagesRouter from "./messagesRouter";

const { Router } = require("express");
const groupsRouter = new Router({ mergeParams: true });

groupsRouter.get("/", (req, res, next) => {
  const userId = getUserIdFromContext();
  return getGroupsForUser(userId)
    .then((groups) => res.json(groups))
    .catch(next);
});

groupsRouter.post("/", (req, res, next) => {
  const groupName = req.body?.groupName || "";
  return createGroup(getUserIdFromContext(), groupName)
    .then((group) => res.json(group))
    .catch(next);
});

groupsRouter.put("/:groupId", (req, res, next) => {
  const userId = getUserIdFromContext();
  const groupId = req.params.groupId;
  const groupData = req.body || {};
  return updateGroupData(userId, groupId, groupData)
    .then((group) => res.json(group))
    .catch(next);
});

groupsRouter.get("/:groupId/members", (req, res, next) => {
  const userId = getUserIdFromContext();
  const groupId = req.params.groupId;
  const searchText = req.query.searchText || "";
  return getMembersInGroup(groupId, userId, searchText)
    .then((group) => res.json(group))
    .catch(next);
});

groupsRouter.put("/:groupId/members", (req, res, next) => {
  const userId = getUserIdFromContext();
  const groupId = req.params.groupId;
  const payload = req.body || {};
  const userIds = payload.userIds || [];
  return addMembersToGroup(groupId, userId, userIds)
    .then((group) => res.json(group))
    .catch(next);
});

groupsRouter.delete("/:groupId/members", (req, res, next) => {
  const userId = getUserIdFromContext();
  const groupId = req.params.groupId;
  const payload = req.body || {};
  const userIds = payload.userIds || [];
  return removeMembersFromGroup(groupId, userId, userIds)
    .then((group) => res.json(group))
    .catch(next);
});

groupsRouter.delete("/:groupId", (req, res, next) => {
  const userId = getUserIdFromContext();
  const groupId = req.params.groupId;
  return deleteGroup(userId, groupId)
    .then((group) => res.json(group))
    .catch(next);
});

groupsRouter.use("/:groupId/messages", messagesRouter)
export default groupsRouter;
