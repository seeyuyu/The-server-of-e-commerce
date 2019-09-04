// const User = require("../models/users");
// const { List } = require("../models/dbs")
const List = require("../models/lists");
const Commodity = require("../models/commoditys")
const listData = require("../public/json/list-id239-h5.json");
class ListCtl {
  async create(ctx) {
    console.log(123);
    // console.log(commodiityData.categoryList)
    await listData.data.wareCategory[0].categoryList.forEach(async item => {
      const data = await List.findOne({ categoryId: item.categoryId });
      if (!data) {
        console.log(item);
        await List.create(item);
      }
    });

    // const result =  await List.insertMany(listData.categoryList)
    console.log("result is ---------------------------------");
    // console.log(result);
    // console.log('result is ---------------------------------')
    // ctx.body = result
  }

  async find(ctx) {
    const { per_page = 20 } = ctx.query;
    const page = Math.max(ctx.query.page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    const lists = await Commodity.find({ mainSecondCmCat: ctx.query.q }).limit(perPage)
      .skip(page * perPage);
    ctx.body = lists;
  }

  async delete(ctx) {
    const list = await List.findOneAndRemove({ categoryId: 400100000 });
    if (!list) {
      ctx.throw(404, "分类不存在");
    }
    ctx.status = 204;
  }
}

module.exports = new ListCtl();
