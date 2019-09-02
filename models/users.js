const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
    default: "male"
  },
  avatar_url: { type: String },
  location: {
    type: [
      {
        province: { type: Number, default: 0 },
        city: { type: Number, default: 0 },
        area: { type: Number, default: 0 },
        address: { type: String, default: "" }
      }
    ],
    select: false
  },
  order: {
    type: [
      {
        order_id: { type: Schema.Types.ObjectId, ref: "Order" } 
        
      }
    ]
  },
  shopping_cart: {
    type: [
      {
        commodity_id: {
          type: Schema.Types.ObjectId, ref: "NewCommodity" 
        },
        count: { type: Number, default: 0 },
        update_time: { type: String }
        //0为什么都没有，1为满38，之类的  这个属性
        // discount_type: { type: Number, enum: [0, 1, 2, 3, 4, 5], default: 0 },
      }
    ],
    select: false
  },
  collect: {
    type: [
      {
        commodity_id: {
          type: Schema.Types.ObjectId, ref: "NewCommodity" 
        },
        store_name: { type: String }
      }
    ],
    select: false
  }
});
module.exports = model("User", userSchema);
