const Router = require("koa-router");
const router = new Router({ prefix: "/collection" });

const { auth,find, delete: del } = require("../public/middlewares")
const {
  create,
} = require("../controllers/collections")

router.get("/", auth, find)
router.post("/", auth, create);
router.delete("/:id", auth, del);

module.exports = router;
