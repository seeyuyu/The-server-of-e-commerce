const Router = require("koa-router");
const router = new Router({ prefix: "/users" });
const jwt = require("koa-jwt");

const {
  create,
  find,
  login,
  update,
  delete: del
} = require("../controllers/users");
const { secret } = require("../config/development");
const auth = jwt({ secret });
// 获取用户列表
router.get("/", auth, find);
router.post("/", create);
router.patch("/", auth, update);
router.delete("/", auth, del);

// 注册接口
router.post("/login", login);

module.exports = router;
