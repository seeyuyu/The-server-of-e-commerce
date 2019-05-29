const mongoose = require("mongoose");
const {Schema,model} = mongoose;

const commoditySchema = new Schema({
  __v: { type: Number, select: false },

// 商品表应该有一个属性，我属于哪个商店，一对多这样省空间
})
module.exports = model("Commodity",commoditySchema);