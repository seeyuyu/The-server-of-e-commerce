const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: Number, required: true },
  password: { type: String, required: true ,select:false},
  gender: { type: String, required: true, enum: ["male", "female"], default: "male"},
  avatar_url: { type:String},
  locations: { type:[{type:Schema.Types.ObjectId,ref : "Location"}],select:false},
  order: { type:[{type:Schema.Types.ObjectId,ref : "Location"}],select:false},
  shopping_car: { type:[{type:Schema.Types.ObjectId,ref : "ShoppingCar"}],select:false},
  collect: { type:[{type:Schema.Types.ObjectId,ref : "Collect"}],select:false},

});
module.exports = model("User",userSchema)