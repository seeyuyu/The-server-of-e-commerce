const mongoose = require("mongoose");
const {Schema,model} = mongoose;

const shoppingSchema = new Schema({
  __v: { type: Number, select: false },


})
module.exports = model("ShoppingCar",shoppingSchema);