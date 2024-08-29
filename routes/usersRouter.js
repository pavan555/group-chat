import { getUserIdFromContext } from "../middlewares/context";
import {
  getUserDetails,
  getUsersDetailsByEmails,
  getUsersDetailsBySearchText,
} from "../services/user-service";
const R = require("ramda");
const { Router } = require("express");
const usersRouter = new Router({ mergeParams: true });

usersRouter.get("/", (req, res, next) => {
  const userId = getUserIdFromContext();
  return getUserDetails(userId)
    .then((user) => res.json(user))
    .catch(next);
});

usersRouter.get("/info", (req, res, next) => {
  const userIds = req.query.userId;
  return getUsersDetailsByEmails(userIds)
    .then((users) => res.json(users))
    .catch(next);
});

//filter already added member/like in client side
usersRouter.get("/search", (req, res, next) => {
  const searchString = req.query.searchText || "";
  return getUsersDetailsBySearchText(searchString)
    .then((users) => res.json(users))
    .catch(next);
});

export default usersRouter;
