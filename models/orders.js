const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    __v: { type: Number, select: false },

    isOverdue: { type: Boolean, select: false, default: false, },  //是否过期
    isPay: { type: Boolean, select: false, default: false, },      //是否支付
    isSend: { type: Boolean, select: false, default: false, },     //是否开始送货
    isArrive: { type: Boolean, select: false, default: false, },   //物流是否送到
    isReturn: { type: Boolean, select: false, default: false, },   //是否退货
    isConfirm: { type: Boolean, select: false, default: false, },  //是否确认收货
    isDelete: { type: Boolean, default: false, select: false, },   //是否删除

    //已删除订单，已失效订单，未发货订单，已结束订单，已退货订单
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true, select: false },
    order_commodity: {
      type: [
        {
          commodity_id: { type: Schema.Types.ObjectId, ref: "Commodity" },
          amount: { type: Number, default: 0 }
        }
      ]
    },

    money_amount: { type: Number, default: 0 }

  },
  { timestamps: true }
);

module.exports = model("Order", orderSchema);
