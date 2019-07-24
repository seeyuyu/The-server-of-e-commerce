const User = require('../models/users');

class UsersCtl{
  async find(ctx){
    const {per_page =10}  = ctx.query
    ctx.body = await User.find({name: new RegExp(ctx.query.q)})
  }
}
module.exports = new UsersCtl();