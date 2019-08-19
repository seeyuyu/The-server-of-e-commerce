const Router = require("koa-router");
const router = new Router({ prefix: "/commoditys" });
const jwt = require("koa-jwt");

const { create ,ajax} = require("../controllers/commoditys.js");
const { secret } = require("../config/development");
const auth = jwt({ secret });
// 获取用户列表

router.post("/create", create);
router.post("/ajax",ajax);
module.exports = router;
