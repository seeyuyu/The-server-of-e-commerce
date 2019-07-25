const mongoose = require("mongoose");
const {Schema,model} = mongoose;

const collectSchema = new Schema({
  __v: { type: Number, select: false },


})
module.exports = model("Collect",collectSchema);