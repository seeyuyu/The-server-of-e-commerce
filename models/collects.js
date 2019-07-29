const mongoose = require("mongoose");
const {Schema,model} = mongoose;

const collectSchema = new Schema({
  __v: { type: Number, select: false },
  collect_commodity:{ type:[{type:Schema.Types.ObjectId,ref:'Commodity'}]},
  buyer:{type:String},
})
module.exports = model("Collect",collectSchema);