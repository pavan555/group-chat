const { Router } = require("express");
const indexRouter = new Router({ mergeParams: true });

indexRouter.get("/health", (req, res, next) => {
  return res.send(`I am healthy ${new Date().toISOString()}`);
});

//will be exposed if update passowrd for user is available
// indexRouter.put("/register/user", (req, res, next) => {
  // const userPayload = req.body || {};
  // return createUserWithPayload(userPayload)
  //   .then((user) => res.json(user))
  //   .catch(next);

// });

export default indexRouter;
