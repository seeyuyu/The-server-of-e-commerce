const jwt = require("koa-jwt");
const { secret } = require("../config/development");
class middleware {
  constructor() {
    this.auth = jwt({ secret });
  }

  // console.log('???/')
}
module.exports = new middleware();
