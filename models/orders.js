const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const Commodity = require("./users");
const orderSchema = new Schema(
  {
    __V: { type: Number, select: false },
    commodity: {
      type: [{ type: Schema.Types.ObjectId, ref: "Commodity" }],
      select: false
    },
    status: {
      type: Number,
      enum: [0, 1, 2, 3, 4],
      required: true,
      default: [3]
    },
    //已删除订单，已失效订单，未发货订单，已结束订单，已退货订单
    create_time: { type: String },
    updata_time: { type: String },
    buyer:{type:String},
    order_commodity: {
      type: [
        { type: Schema.Types.ObjectId, ref: "Commodity" },
        { mount: { type: Number, default: 0 } },
      ]
    }
  },
  { timestamps: true }
);


module.exports = model("Order", orderSchema);
