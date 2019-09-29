const Router = require("koa-router");
const router = new Router({ prefix: "/collection" });

const { auth, find, delete: del,checkCommodity } = require("../public/middlewares")
const {
  create
} = require("../controllers/collections")

router.get("/", auth, find)
router.post("/", auth,checkCommodity, create);
router.delete("/:id", auth,checkCommodity, del);

module.exports = router;
