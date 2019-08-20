const Router = require("koa-router");
const router = new Router({ prefix: "/liots" });
const jwt = require("koa-jwt");
const {
  create,
  find,
  delete:del
} = require("../controllers/lists");

const { secret } = require("../config/development");
const auth = jwt({ secret });

// 获取用户列表
router.get("/", find);

router.post('/create', create);

router.delete('/',del)
module.exports = router;
