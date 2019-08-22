const Router = require("koa-router");
const router = new Router({ prefix: "/commoditys" });
const jwt = require("koa-jwt");

const { getFromJson, getFromOnline, find ,create} = require("../controllers/commoditys.js");
const { secret } = require("../config/development");
const auth = jwt({ secret });
// 获取用户列表

router.get("/json", getFromJson);
router.get("/online", getFromOnline);
router.get("/", find);
router.post("/",create)
module.exports = router;
