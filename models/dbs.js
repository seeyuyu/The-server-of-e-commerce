const List = require("../models/lists");
const User = require("../models/users");
const Commodity = require("../models/commoditys");
const dbs = {};
// dbs.User = User;
dbs.List = List;
dbs.Commodity = Commodity;
dbs.User = User;

module.exports = dbs;
