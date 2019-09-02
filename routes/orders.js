const Router = require("koa-router")
const router = new Router({ prefix: "/order" })
const { find, auth, delete: del } = require("../public/middlewares")
const { create, update } = require("../controllers/orders")

router.get("/", auth, find)
router.post("/", auth, create)
router.put("/:id", auth, update)
router.delete("/:id", auth, del)

module.exports = router