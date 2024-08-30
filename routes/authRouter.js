import { cookieOptions } from "../middlewares/authenticator";
import { generateToken } from "../utils/jwt-utils";

const { SESSION_TIME_OUT, SESSION_ID_KEY } = require("../config/variable");
const { loginUser } = require("../services/user-service");

const { Router } = require("express");
const authRouter = new Router({ mergeParams: true });
const R = require("ramda");

authRouter.post("/login", async (req, res, next) => {
  console.log("authRouter : Login for user name", req.params.userName);
  return loginUser(req.body.emailId, req.body.password)
    .then(async (resp) => {
      const user = resp;
      const keys = ["name", "emailId", "admin"];
      let principal = R.assoc("userId", user.emailId, R.pick(keys, user));
      const token = await generateToken(principal, principal.emailId);
      res.cookie(
        SESSION_ID_KEY,
        token,
        cookieOptions({ maxAge: SESSION_TIME_OUT * 1000 })
      );
      return res.json({ ...principal, token: token });
    })
    .catch(next);
});

authRouter.post("/logout", async (req, res, next) => {
  console.log("authRouter : logout for user name", req.params.userName);

  return Promise.resolve()
    .then(() => {
      res.clearCookie(SESSION_ID_KEY);
      res.send("Successfully logged out");
    })
    .catch(next);
});

export default authRouter;
