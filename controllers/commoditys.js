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

  async ajax(ctx) {
    const commodityArray = [];

    const getCommodityId = (obj = {}) => {
      const { childCategoryList, categoryId } = obj;

      // console.log( childCategoryList||childCategoryList.length)
      // 如果不是个数组那就push id
      if (childCategoryList == undefined || childCategoryList.length <1) {
        commodityArray.push(categoryId);
        console.log(`categoryId is`, categoryId);
        return null;
        // 如果是个数组，那就在遍历一遍
      } else {
        console.log("进来了递归函数")
        childCategoryList.forEach(item =>{
          return getCommodityId(childCategoryList);
        })
        
      }
    };

    try {
      const listArray = await List.find();
      listArray.forEach(async item => {
        getCommodityId(item);
      });
      console.log("id的总数是…… ", commodityArray.length);
    } catch {
      throw new Error("拿list数据出错");
    }

    // const dataJson = {
    //   venderId: 1,
    //   storeId: 239,
    //   businessCode: 1,
    //   from: 1,
    //   categoryType: 1,
    //   pageNum: 1,
    //   pageSize: 20,
    //   categoryId: "21382",
    //   categoryLevel: 1
    // };

    // const baseUrl = `http://searchgw.dmall.com/mp/search/`;
    // try {
    //   const data = await axios.post(baseUrl + "wareSearch", {
    //     param: JSON.stringify(dataJson)
    //   });
    //   console.log(data);
    //   ctx.body = data.data;
    // } catch {
    //   throw new Error("err");
    // }

    //   axios
    //     .post(baseUrl + "wareSearch", {
    //       param: JSON.stringify(dataJson)
    //     })
    //     .then(res => {
    //       console.log("回调触发");
    //       if (res.data.code == "0000") {
    //         console.log(res.data.data.wareList);
    //         that.classifyList = res.data.data;
    //       } else {
    //         alert(res.data.msg);
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       console.log("错误捕捉");
    //     });
  }
}

module.exports = new commodityCtl();
