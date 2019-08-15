const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const listSchema = new Schema({
  __v: { type: Number, select: false },
  categoryId: { type: String, required: true },
  categoryImgPathReal: { type: String },
  categoryName: { type: String, required: true },
  categoryType: { type: Number, default: 1 },
  globalSelection: { type: Boolean, default: false },
  isBento: { type: Boolean, default: false },
  // 第一级别的菜单
  childCategoryList: {
    type: [
      {
        categoryId: { type: String, required: true },
        categoryImgPathReal: { type: String },
        categoryName: { type: String, required: true },
        categoryType: { type: Number, default: 1 },
        globalSelection: { type: Boolean, default: false },
        isBento: { type: Boolean, default: false },
        // 第二级别的菜单
        childCategoryList: {
          type: [
            {
              categoryId: { type: String, required: true },
              categoryImgPathReal: { type: String },
              categoryName: { type: String, required: true },
              categoryType: { type: Number, default: 1 },
              globalSelection: { type: Boolean, default: false },
              isBento: { type: Boolean, default: false },
              // 第三级别的菜单
              childCategoryList: {
                type: [
                  {
                    categoryId: { type: String, required: true },
                    categoryImgPathReal: { type: String },
                    categoryName: { type: String, required: true },
                    categoryType: { type: Number, default: 1 },
                    globalSelection: { type: Boolean, default: false },
                    isBento: { type: Boolean, default: false }
                  }
                ],
                required: false
              }
            }
          ],
          required: false
        }
      }
    ],
    required: false
  }
  // 商品表应该有一个属性，我属于哪个商店，一对多这样省空间
});
module.exports = model("List", listSchema);
