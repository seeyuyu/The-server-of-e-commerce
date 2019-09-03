const Router = require("koa-router")
const router = new Router({ prefix: "/order" })
const { auth, } = require("../public/middlewares")
const { find, create, update, delete: del, pay, confirm, confirmDel,isReturn, delAll } = require("../controllers/orders")

router.get("/", auth, find)
router.post("/", auth, create)
router.put("/:id", auth, update)
router.delete("/:id", auth, confirmDel)
// router.delete("/all", auth, delAll)

router.patch("/isreturn/:id", auth, isReturn)
router.patch("/ispay/:id", auth, pay)
router.patch("/isconfirm/:id", auth, confirm) //确认收货
router.patch("/isdelete/:id", auth, del)


module.exports = router