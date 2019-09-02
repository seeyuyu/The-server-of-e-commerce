const User = require('../models/users')
class OrderCtl {
  async create(ctx) {
    console.log(ctx.request.body)
  }

  async update(ctx) {
    console.log(ctx.request.body)

  }

}
module.exports = new OrderCtl()