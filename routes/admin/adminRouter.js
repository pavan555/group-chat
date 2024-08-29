const { Router } = require("express");
const adminRouter = new Router({ mergeParams: true });
import adminUsersRouter from "./admin-users-router";
adminRouter.get("/health", (req, res, next) => {
  return res.send(`I am healthy ${new Date().toISOString()}`);
});

adminRouter.use("/users", adminUsersRouter);

export default adminRouter;
