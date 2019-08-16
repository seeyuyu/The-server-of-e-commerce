const Commodity = require("../models/commoditys");
const searchDataUrl = "../public/searchData";
const fs = require("fs");

class commodityCtl {
  async create(ctx) {
    try{
      await fs.readdirSync(searchDataUrl,err=>{
        console.log("log is ");
        console.log(err);

      }).forEach( async file => {
        console.log(file)
        console.log('file-----------------------------------------------')

        const data = Commodity.findOne({"cate":file.categoryId})
        if(data){
          return
        }else{
          console.log(file.code)
          ctx.body = file.code;
          // await Commodity.create(file)
        }
      });

    }catch{
      throw(new Error('读取文件失败'));
    }

  }
}

module.exports=  new commodityCtl();
