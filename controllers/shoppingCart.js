const User = require("../models/users");
const Commodity = require("../models/commoditys");
class ShoppingCartCtl {
  // 查看购物车


  async create (ctx) {
    let isCurrent = false;
    ctx.verifyParams({
      amount: { type: "string", required: false },
      _id: { type: "string", required: true }
    });
    console.log("ctx.request.body", ctx.request.body);

    const { amount = 1 } = ctx.request.body;
    const data = await User.findById(ctx.state.user._id).select(
      "shopping_cart"
    );
    const { shopping_cart } = data;
    console.log(shopping_cart);
    console.log('ctx.request.body._id ------', ctx.request.body._id)
    for (const value of shopping_cart) {
      if (value.commodity_id == ctx.request.body._id) {
        if (amount == 1) {
          value.amount++
        } else {
          value.amount = amount
        }
        isCurrent = true;
        console.log('value is',value)
        console.log("找到了commodity_di，并且修改了amount");
        break;
      }
    }

    // 如果不存在，那我们就将其push
    if (!isCurrent) {
      console.log("执行了不存在的操作");
      shopping_cart.push({
        commodity_id: ctx.request.body._id,
        amount: amount == 1 ? 1 : amount
      });
    }
    // data.shopping_cart = [];
    try {
      const body = await User.updateOne({ _id: ctx.state.user._id }, data);
      ctx.body = body
    } catch (e) {
      ctx.throw(500, e);
    }
    console.log("data is ++++", data);
  }

  // async delete(ctx) {
  //   console.log('hh')
  //   const data = await User.findById(ctx.state.user._id).select(
  //     "shopping_cart"
  //   );
  //   let { shopping_cart } = data;

  //   // let newShopping_cart = Array.from(data.shopping_cart)

  //   console.log('newShopping_cart  --- ', shopping_cart)

  //   ctx.params.id.split(';').filter(e => e).map(item => {
  //     shopping_cart = shopping_cart.filter(list => {
  //       // console.log('item is ---------------------',item)
  //       // console.log('list.commodity_id is ------- ',list.commodity_id)
  //       return item != list.commodity_id
  //     })
  //   })
  //   data.shopping_cart = shopping_cart
  //   console.log('shopping_cart  +++ ', shopping_cart)
  //   console.log('data==========', data)

  //   try {
  //     const body = await User.updateOne({ _id: ctx.state.user._id }, data);
  //     ctx.body = body
  //   } catch (e) {
  //     ctx.throw(500, e);
  //   }

  // }
}

module.exports = new ShoppingCartCtl();
