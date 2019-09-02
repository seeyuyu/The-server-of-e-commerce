const User = require("../models/users");

class CollectionCtl {
  
  async create(ctx) {
    let isCurrent = false;
    ctx.verifyParams({
      _id: { type: "string", required: true }
    });
    console.log("ctx.request.body", ctx.request.body);
    const data = await User.findById(ctx.state.user._id).select(
      "collect"
    );

    const { collect } = data;
    console.log(collect);
    console.log('ctx.request.body._id ------', ctx.request.body._id)
    for (const value of collect) {
      if (value.commodity_id == ctx.request.body._id) {
        isCurrent = true;
        console.log("找到了collect");
        break;
      }
    }

    // 如果不存在，那我们就将其push
    if (!isCurrent) {
      console.log("执行了不存在的操作");
      collect.push({
        commodity_id: ctx.request.body._id,
      });
    }
    // data.shopping_cart = [];
    try {
      const body = await User.updateOne({ _id: ctx.state.user._id }, data);
      ctx.throw(200)
    } catch (e) {
      ctx.throw(500, e);
    }
    console.log("data is ++++", data);
  }

}
module.exports = new CollectionCtl();