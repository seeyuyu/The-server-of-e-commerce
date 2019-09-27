const Router = require("koa-router");
const router = new Router({ prefix: "/shopping-cart" });
const { auth,find, delete: del } = require("../public/middlewares")

const {
  create
  // updata,
} = require("../controllers/shoppingCart");
// 查看所有
router.get("/", auth, find);
// 添加属性
router.post("/", auth, create);
// 修改某个属性
// router.put("/:id", auth, updata);
// 购物车删除某条属性
// 批量删除有两种方法：1、url上用逗号分隔开，2、先post传递过去，在delete
router.delete("/:id", auth, del);
 



module.exports = router;
