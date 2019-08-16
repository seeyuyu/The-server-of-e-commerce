// const User = require("../models/users");
const List = require("../models/Lists")
const jsonwebtoken = require("jsonwebtoken");
const { secret } = require("../config/development");
const listData = require("../public/json/lists.json")
class ListCtl {

  async create(ctx) {
    console.log(123)
    // console.log(commodiityData.categoryList)
    await listData.categoryList.forEach( async (item) =>{
      const  data = await List.findOne({"categoryId": item.categoryId})
      if(!data){
        console.log(item)
        await List.create(item)
      }
    });

    // const result =  await List.insertMany(listData.categoryList)
    console.log('result is ---------------------------------')
    // console.log(result);
    // console.log('result is ---------------------------------')
    // ctx.body = result
  };

  async find(ctx){
    const lists = await List.find({})
    ctx.body = lists
  }
  
  async delete(ctx){
    const list = await List.findOneAndRemove({'categoryId':400100000})
    if(!list){
      ctx.throw(404,"分类不存在");
    }
    ctx.status =204
  }
}

module.exports = new ListCtl();
