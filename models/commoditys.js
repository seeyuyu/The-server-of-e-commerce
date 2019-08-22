const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const commoditySchema = new Schema(
  {
    __V: { type: Number, select: false },
    collageTagPreSell: { type: Boolean, default: false },
    cornerMarkImgList: { type: Array, default: [] },
    mainFirstCmCat: { type: Number, select: false }, //新增
    mainSecondCmCat: { type: Number },
    mainThirdCmCat: { type: Number, select: false }, //新增 暂时不用 移动端抓包抓不到
    brandId: { type: Number, select: false }, //新增 暂时不用 移动端抓包抓不到

    wareImgList: { type: Array },
    cornerSign: { type: Array },
    // warebaseName: { type: String, required: true },
    warebaseKeyword: { type: String }, //详情页介绍关键字，自然熟，无任何添加
    // warebaseSkuId: { type: String, required: true },
    // warebaseWareId: { type: String, required: true },
    // warebaseBrandId: { type: String },
    shipmentTimeTip: { type: String }, //预计两天发货
    storeLogo: { type: String },
    storeName: { type: String },

    referenceWareList: [
      //推荐商品的列表
      {
        ware_id: { type: { type: Schema.Types.ObjectId, ref: "Commodity" } }
      }
    ],
    monthSales: { type: String },
    offlinePrice: { type: Number },
    onlinePrice: { type: Number },
    onlinePromotionPrice: { type: Number },
    priceDisplay: { type: String },
    promoting: { type: String },
    promotionWare: { type: Boolean },
    resultData: { type: String },
    resultType: { type: Number },
    searchRecTitle: { type: String },
    sell: { type: Boolean },
    sku: { type: String },
    skuTagDataList: { type: Array },
    status: { type: String },
    storeId: { type: Number },
    suitPromotionWareVO: { type: String },
    tagPreSell: { type: Boolean },
    venderId: { type: Number },
    wareDetailImgList: { type: Array },
    wareId: { type: String },
    wareImg: { type: String },
    wareName: { type: String },
    warePrice: { type: String },
    wareStatus: { type: Number },
    wareType: { type: String },
    promotionWareVO: {
      type: [
        {
          isMatchSimplePro: { type: Boolean },
          marketPrice: { type: Number },
          origPrice: { type: Number },
          priceCalcProId: { type: Number },
          promotionInfoList: {
            type: [
              {
                displayInfo: {
                  proActId: { type: String },
                  proActLinkDesc: { type: String },
                  proActUrl: { type: String },
                  proLimitDesc: { type: String },
                  proSlogan: { type: String },
                  proTag: { type: String }
                },
                giftGoods: { type: String },
                maxOddLimitNum: { type: String },
                proBatchNum: { type: String },
                proCode: { type: String },
                proId: { type: Number },
                proName: { type: String },
                proSchedule: { type: String },
                proSubType: { type: String },
                proType: { type: String },
                runningStatus: { type: String },
                suitGoods: { type: String },
                tradeGoods: { type: String }
              }
            ]
          },
          promotionInfoListUp: { type: Array },
          showLinePrice: { type: Boolean },
          skuId: { type: Number },
          skuName: { type: String },
          skuType: { type: String },
          storeId: { type: String },
          unitProPrice: { type: Number },
          venderId: { type: String }
        }
      ]
    }

    //已删除订单，已失效订单，未发货订单，已结束订单，已退货订单
  },
  { timestamps: true }
);

module.exports = model("newCommodity", commoditySchema);
