const Router = require("koa-router");
const router = new Router({ prefix: "/users" });
const jwt = require("koa-jwt");

const {} = require("../controllers/users");
const { secret } = require("../config");
const auth = jwt({ secret });

router.get("/", function(ctx, next) {
  ctx.body = "this is a users response!";
  next();
});

router.get("/bar", function(ctx, next) {
  ctx.body = "this is a users/bar response";
});

module.exports = router;
