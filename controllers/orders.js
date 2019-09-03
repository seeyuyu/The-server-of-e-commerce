const Order = require('../models/orders')
const Commodity = require("../models/commoditys")
class OrderCtl {
  async find(ctx) {
    console.log(ctx.request.body)
    try {
      const data = await Order.find({}).
        select(['isPay', 'isDelete', 'isConfirm', 'isReturn'])
      ctx.body = data

    } catch (e) {
      ctx.throw(500, e)
    }
  }
  async create(ctx) {
    let data = JSON.parse(ctx.request.body.order_commodity)
    // console.log(data)
    const money_amount = data.reduce((sum, item) => {
      console.log(item.warePrice)
      return sum + item.warePrice * item.amount
    }, 0)
    const order = {
      order_commodity: data,
      creator: ctx.state.user._id,
      money_amount
    }
    console.log(order)
    try {
      const response = await new Order(order).save()
      ctx.throw(200)
    } catch (e) {
      ctx.throw(500, e)
    }
  }


  async update(ctx) {
    console.log(ctx.request.body)
    await Order.deleteMany({ creator: '5d55022667665d0f390f5781' })
  }
  async delete(ctx) {
    console.log(ctx.request.body)
    try {
      const data = await Order.findById(ctx.params.id)
      data.isDelete = true;
      await Order.findByIdAndUpdate(ctx.params.id, data)

    } catch (e) {
      ctx.throw(500, e)
    }
  }

  async pay(ctx) {
    console.log(ctx.request.body)
    try {
      const data = await Order.findById(ctx.params.id)
      data.isPay = true;
      await Order.findByIdAndUpdate(ctx.params.id, data)

    } catch (e) {
      ctx.throw(500, e)
    }
  }
  async confirm(ctx) {
    console.log(ctx.request.body)
    try {
      const data = await Order.findById(ctx.params.id)
      data.isConfirm = true;
      await Order.findByIdAndUpdate(ctx.params.id, data)

    } catch (e) {
      ctx.throw(500, e)
    }

  }
  async confirmDel(ctx) {
    console.log("删除订单")

    try {
      ctx.body = await Order.findByIdAndRemove(ctx.params.id)
    } catch (e) {
      ctx.throw(500, e)
    }
  }

  async delAll(ctx) {
    console.log('delete all')
    try {
      ctx.body = await Order.remove({})
    } catch (e) {
      ctx.throw(500, e)
    }
  }
  async isReturn(ctx) {
    console.log(ctx.request.body)
    try {
      const data = await Order.findById(ctx.params.id)
      data.isReturn = true;
      await Order.findByIdAndUpdate(ctx.params.id, data)

    } catch (e) {
      ctx.throw(500, e)
    }
  }
}
module.exports = new OrderCtl()