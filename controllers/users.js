const User = require("../models/users");
const jsonwebtoken = require("jsonwebtoken");
const { secret } = require("../config/development");
class UsersCtl {
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, "没有权限");
    }
    console.log("检查通过");
    next();
  }

  async create(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true }
    });
    const { name } = ctx.request.body;
    const repeatOne = await User.findOne({ name });
    if (repeatOne) {
      ctx.throw(409, "用户名已经被使用");
    }
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }

  async login(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true }
    });
    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(401, "用户名或密码错误");
    }
    const { _id, name } = user;
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: "1d" });
    ctx.body = { token };
  }

  async find(ctx) {
    const { per_page = 10 } = ctx.query;
    const page = Math.max(ctx.query.page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    ctx.body = await User.find({ name: new RegExp(ctx.query.q) })
      .limit(perPage)
      .skip(page * perPage);
  }

  async update(ctx) {
    console.log("进入了update接口");
    ctx.verifyParams({
      name: { type: "string", required: false },
      password: { type: "string", required: false },
      gender: { type: "string", required: false },
      avatar_url: { type: "string", required: false },
      locations: { type: "array", itemType: "object", required: false },
      order: { type: "array", itemType: "object", required: false },
      shopping_car: { type: "string", itemType: "object", required: false },
      collect: { type: "array", itemType: "object", required: false }
    });
    console.log(ctx.params);
    // const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    const user = await User.findById(ctx.params.id);
    console.log("user is ", user);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    User.updateOne(user, ctx.request.body, res => {
      ctx.body = 222222222222;
      console.log("user2 is ", 11222222222222222);
    });
  }

  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.status = 204;
  }
}
module.exports = new UsersCtl();
