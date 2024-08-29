import { getUserIdFromContext } from "../../middlewares/context";
import {
  createUserWithPayload,
  getUserDetails,
} from "../../services/user-service";

const R = require("ramda");

const { Router } = require("express");
const usersRouter = new Router({ mergeParams: true });

//Accessed by only admins
usersRouter.get("/", (req, res, next) => {
  const userId = getUserIdFromContext();
  return getUserDetails(userId)
    .then((user) => res.json(user))
    .catch(next);
});

usersRouter.post("/", (req, res, next) => {
  const userPayload = req.body || {};

  return createUserWithPayload(userPayload)
    .then((user) => res.json(user))
    .catch(next);
});

export default usersRouter;
