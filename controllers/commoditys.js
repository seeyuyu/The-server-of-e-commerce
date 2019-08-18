const Commodity = require("../models/commoditys");
const searchDataUrl = "./public/searchData";
const fs = require("fs");

class commodityCtl {
  async create(ctx) {
    try{
      console.log(searchDataUrl)
      await fs.readdirSync(searchDataUrl).forEach( async file => {
        console.log(file)
        let abc = await fs.readFileSync(`${searchDataUrl}/${file}`,'utf8')
        console.log(JSON.parse(abc).data.adList[0])
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
