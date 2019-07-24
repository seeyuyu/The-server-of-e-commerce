const Router = require("koa-router");
const jwt = require("koa-jwt");
const router = new Router({ prefix: "/users" });

const {} = require("../controllers/users");
const { secret } = require("../config");
const auth = jwt({ secret });

router.get("/", function(ctx, next) {
  ctx.body = "this is a users response!";
});

router.get("/bar", function(ctx, next) {
  ctx.body = "this is a users/bar response";
});

module.exports = router;
