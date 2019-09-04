// const User = require("../models/users");
// const { List } = require("../models/dbs")
const List = require("../models/lists");

class ListCtl {

  async find(ctx) {
    const lists = await List.find({});
    ctx.body = lists;
  }
  
}

module.exports = new ListCtl();
