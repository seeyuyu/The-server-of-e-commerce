const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: Number, required: true },
  password: { type: String, required: true, select: false },
  gender: { type: String, required: true, enum: ["male", "female"], default: "male" },
  avatar_url: { type: String },
  locations: {
    type: [{ type: Schema.Types.ObjectId, ref: "Location" }], select: false
  },
  order: { type: [{ type: Schema.Types.ObjectId, ref: "Order" }], select: false },
  shopping_car: {
    type: [
      {
        commodity_id: { type: String },
        count: { type: Number, default: 0 },
        update_time: { type: String },
        //0为什么都没有，1为满38，之类的
        discount_type: { type: Number, enum: [0, 1, 2, 3, 4, 5], default: 0 },
        store_name: { type: String }
      }
    ], select: false
  },
  collect: {
    type: [
      {
        commodity_id: { type: String },
        store_name: { type: String }
      }
    ], select: false
  },
});
module.exports = model("User", userSchema)