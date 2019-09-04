const Router = require("koa-router");
const router = new Router({ prefix: "/classify" });
const jwt = require("koa-jwt");
const {
  find,
} = require("../controllers/lists");

const { secret } = require("../config/development");
const auth = jwt({ secret });

// 获取用户列表
router.get("/", find);

// router.post('/create', create);
// router.delete('/',del)
module.exports = router;
