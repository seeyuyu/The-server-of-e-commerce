const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const commoditySchema = new Schema(
  {
    __v: { type: Number, select: false },
    collageTagPreSell: { type: Boolean, default: false, select: false },
    cornerMarkImgList: { type: Array, default: [], select: false },
    mainFirstCmCat: { type: Number, select: false }, //新增
    mainSecondCmCat: { type: Number },
    mainThirdCmCat: { type: Number, select: false }, //新增 暂时不用 移动端抓包抓不到
    brandId: { type: Number, select: false }, //新增 暂时不用 移动端抓包抓不到
    wareImgList: { type: Array, select: false },
    cornerSign: { type: Array, select: false },
    // warebaseName: { type: String, required: true },
    warebaseKeyword: { type: String, select: false }, //详情页介绍关键字，自然熟，无任何添加
    // warebaseSkuId: { type: String, required: true },
    // warebaseWareId: { type: String, required: true },
    // warebaseBrandId: { type: String },
    shipmentTimeTip: { type: String, select: false }, //预计两天发货
    storeLogo: { type: String, select: false },
    storeName: { type: String, select: false },

    referenceWareList: {
      type: [
        //推荐商品的列表
        {
          _id: {
            type: { type: Schema.Types.ObjectId, ref: "Commodity" },
            select: false
          }
        }
      ],
      select: false
    },
    monthSales: { type: String, select: false },
    offlinePrice: { type: Number, select: false },
    onlinePrice: { type: Number, select: false },
    onlinePromotionPrice: { type: Number, select: false },
    priceDisplay: { type: String, select: false },
    promoting: { type: String, select: false },
    promotionWare: { type: Boolean, select: false },
    resultData: { type: String, select: false },
    resultType: { type: Number, select: false },
    searchRecTitle: { type: String, select: false },
    sell: { type: Boolean, select: false },
    sku: { type: String },
    skuTagDataList: { type: Array, select: false },
    status: { type: String, select: false },
    storeId: { type: Number, select: false },
    suitPromotionWareVO: { type: String, select: false },
    tagPreSell: { type: Boolean, select: false },
    venderId: { type: Number, select: false },
    wareDetailImgList: { type: Array, select: false },
    wareId: { type: String },
    wareImg: { type: String },
    wareName: { type: String },
    warePrice: { type: String },
    wareStatus: { type: Number, select: false },
    wareType: { type: String, select: false },
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
      ],
      select: false
    }

    //已删除订单，已失效订单，未发货订单，已结束订单，已退货订单
  },
  { timestamps: true }
);

module.exports = model("NewCommodity", commoditySchema);
