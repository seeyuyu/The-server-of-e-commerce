const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const commoditySchema = new Schema({
  __v: { type: Number, select: false },
  categoryId: { type: String, required: true },
  categoryImgPathReal: { type: String, required: true },
  categoryName: { type: String, required: true },
  childCategoryList: {
    type: [
      {
        categoryId: { type: String, required: true },
        categoryImgPathReal: { type: String, required: true },
        categoryName: { type: String, required: true },
        globalSelection: { type: Boolean, default: false },
        isBento: { type: Boolean, default: false },
        childCategoryList: {
          type: [
            {
              categoryId: { type: String, required: true },
              categoryImgPathReal: { type: String, required: true },
              categoryName: { type: String, required: true },
              globalSelection: { type: Boolean, default: false },
              isBento: { type: Boolean, default: false }
            }
          ]
        }
      }
    ],
    required: true
  },
  globalSelection: { type: Boolean, default: false },
  isBento: { type: Boolean, default: false },

  categoryImgPathReal: "",
  categoryName: "品牌直发",
  categoryType: 1,
  childCategoryList: [
    {
      categoryId: "21383",
      categoryImgPathReal: "",
      categoryName: "良品铺子",
      categoryType: 1,
      childCategoryList: [
        {
          categoryId: "21391",
          categoryImgPathReal: "",
          categoryName: "美味零食",
          categoryType: 1,
          childCategoryList: [],
          globalSelection: false,
          isBento: false
        }
      ],
      globalSelection: false,
      isBento: false
    },
    {
      categoryId: "21404",
      categoryImgPathReal: "",
      categoryName: "蓝漂",
      categoryType: 1,
      childCategoryList: [
        {
          categoryId: "21405",
          categoryImgPathReal: "",
          categoryName: "纸品家清",
          categoryType: 1,
          childCategoryList: [],
          globalSelection: false,
          isBento: false
        }
      ],
      globalSelection: false,
      isBento: false
    }
  ],
  globalSelection: false,
  isBento: false

  // 商品表应该有一个属性，我属于哪个商店，一对多这样省空间
});
module.exports = model("Commodity", commoditySchema);
