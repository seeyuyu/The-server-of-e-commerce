const User = require("../models/users");
class ShoppingCartCtl {
  // 查看购物车
  async find(ctx) {
    console.log(ctx.state);
    const data = await User.findById(ctx.state.user._id).select(
      "shopping_cart"
    );
    console.log("data is -----", data);
    ctx.body = {
      code: 0,
      data: data.shopping_cart,
      message: "success"
    };
  }

  async create(ctx) {
    let isCurrent = false;
    ctx.verifyParams({
      count: { type: "string", required: false },
      _id: { type: "string", required: true }
    });
    console.log("ctx.request.body", ctx.request.body);

    const { count = 1 } = ctx.request.body;
    const data = await User.findById(ctx.state.user._id).select(
      "shopping_cart"
    );
    const { shopping_cart } = data;
    console.log(shopping_cart);
    console.log('ctx.request.body._id ------',ctx.request.body._id)
    for (const value of shopping_cart) {
      if (value.commodity_id == ctx.request.body._id) {
        if (count == 1) {
          value.count++
        } else {
          value.count = count
        }
        isCurrent = true;
        console.log("找到了commodity_di，并且修改了count");
        break;
      }
    }

    // 如果不存在，那我们就将其push
    if (!isCurrent) {
      console.log("执行了不存在的操作");
      shopping_cart.push({
        commodity_id: ctx.request.body._id,
        count: count == 1 ? 1 : count
      });
    }
    // data.shopping_cart = [];
    try {
      await User.updateOne({ _id: ctx.state.user._id }, data);
    } catch (e) {
      ctx.throw(500, e);
    }
    console.log("data is ++++", data);
  }

  async updata(ctx) {
    let isCurrent = false;
    ctx.verifyParams({
      count: { type: "string", required: true },
      _id: { type: "string", required: true }
    });
    console.log("ctx.request.body", ctx.request.body);

    const { count = 1 } = ctx.request.body;
    const data = await User.findById(ctx.state.user._id).select(
      "shopping_cart"
    );
    const { shopping_cart } = data;
    console.log(shopping_cart);
    for (const value of shopping_cart) {
      if (value.commodity_id == ctx.request.body._id) {
      value.count = count
        isCurrent = true;
        console.log("找到了commodity_di，并且修改了count");
        break;
      }
    }
 
    // 如果不存在，那我们就将其push
    if (!isCurrent) {
      console.log("执行了不存在的操作");
      shopping_cart.push({
        commodity_id: ctx.request.body._id,
        count: count == 1 ? 1 : count
      });
    }
    data.shopping_cart = [];
    try {
      await User.updateOne({ _id: ctx.state.user._id }, data);
    } catch (e) {
      ctx.throw(500, e);
    }
    console.log("data is ++++", data);
  }
  async delete(ctx) {
    console.log('hh')
  }
}

module.exports = new ShoppingCartCtl();
