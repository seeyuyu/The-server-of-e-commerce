const Commodity = require("../models/commoditys");
const List = require("../models/lists");

// const { List, Commodity } = require("../models/dbs");
const searchDataUrl = "./public/searchData";
const axios = require("axios");
const fs = require("fs");

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
// axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
// 数据发送到服务器之前进行的操作
axios.defaults.transformRequest = [
  function(data) {
    let ret = "";
    for (let it in data) {
      ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
    }
    return ret;
  }
];

class commodityCtl {
  async create(ctx) {
    try {
      console.log(searchDataUrl);
      await fs.readdirSync(searchDataUrl).forEach(async file => {
        console.log(file);
        let abc = await fs.readFileSync(`${searchDataUrl}/${file}`, "utf8");
        console.log(JSON.parse(abc).data.adList[0]);
        console.log("file-----------------------------------------------");
        const data = Commodity.findOne({ cate: file.categoryId });
        if (data) {
          return;
        } else {
          console.log(file.code);
          ctx.body = file.code;
          // await Commodity.create(file)
        }
      });
    } catch {
      throw new Error("读取文件失败");
    }
  }

  async getAllData(ctx) {
    let count = 0;
    const baseUrl = `http://searchgw.dmall.com/mp/search/`;
    const dataJson = {
      venderId: 1,
      storeId: 239,
      businessCode: 1,
      from: 1,
      categoryType: 1,
      pageNum: 1,
      pageSize: 20,
      categoryId: "11341",
      categoryLevel: 1
    };

    const getCommodityIdArray = async listArray => {
      const commodityArray = [];
      await listArray.forEach(async item => {
        // getCommodityId(item);
        const { childCategoryList, categoryId } = item;
        commodityArray.push(categoryId);
        console.log(`categoryId is`, categoryId);
        if (Array.isArray(childCategoryList) && childCategoryList.length > 0) {
          console.log("进来了内层函数" + count++);
          childCategoryList.forEach(item => {
            commodityArray.push(item.categoryId);
          });
        }
      });

      console.log("commodityArray.length is ", commodityArray.length);
      return commodityArray;
    };

    const httpGet = async commodityArray => {
      let count = 1;
      commodityArray.forEach(async item => {
        dataJson.categoryId = item;
        try {
          const data = await axios.post(baseUrl + "wareSearch", {
            param: JSON.stringify(dataJson)
          });
          const { wareList, pageInfo } = data.data.data;
          if (count) {
            // console.log("p90-------", wareList);
            console.log("p91-------", pageInfo);
            count++;


            if (Array.isArray(wareList) && wareList.length >= 1) {
              await wareList.forEach(async item => {
                console.log(' p97---------------item.wareId is ',item.wareId)
                if (!await Commodity.findOne({ wareId: item.wareId })) {
                  console.log('存东西啊')
                  try{
                    const data = await new Commodity(item).save();
                    console.log("存东西的回执单",count)
                  }catch{
                    throw new Error('存库出错了');
                  }
             
                }
              });
            }

          }

     
        } catch {
          throw new Error(
            "请求ajax数据出错,categoryId is ",
            dataJson.categoryId
          );
        }
      });
    };

    try {
      const listArray = await List.find();
      const commodityArray = await getCommodityIdArray(listArray);
      console.log("p101----------commodityArray is", commodityArray);
      await httpGet(commodityArray);
    } catch {
      throw new Error("遍历list出错");
    }
  }
  async get(ctx){
    const data = await Commodity.find({});
    ctx.body = data
  }
}

module.exports = new commodityCtl();
