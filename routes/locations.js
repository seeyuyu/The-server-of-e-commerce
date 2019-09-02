const Router = require("koa-router");
const router = new Router({ prefix: '/location' })
const { auth, find, } = require("../public/middlewares")

const {
  create, update, delete: del
} = require("../controllers/locations")

router.get("/", auth, find)
router.post("/", auth, create)
router.put("/:id", auth, update)
router.delete("/:id", auth, del)

module.exports = router