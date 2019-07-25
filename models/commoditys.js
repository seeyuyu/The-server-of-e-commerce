const mongoose = require("mongoose");
const {Schema,model} = mongoose;

const commoditySchema = new Schema({
  __v: { type: Number, select: false },


})
module.exports = model("Commodity",commoditySchema);