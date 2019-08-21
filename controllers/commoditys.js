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
    const delay = time => {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve();
        }, time);
      });
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
    const saveDB = async wareList => {
      if (Array.isArray(wareList) && wareList.length >= 1) {
        await wareList.forEach(async item => {
          // console.log(" p97---------------item.wareId is ", item.wareId);
          if (!(await Commodity.findOne({ wareId: item.wareId }))) {
            console.log("存东西啊");

            try {
              const data = await new Commodity(item).save();
              // console.log("存东西的回执单", count);
              console.log(
                "当前数据总量是————————————————",
                await Commodity.count()
              );
            } catch {
              throw new Error("存库出错了");
            }
          } else {
            console.log(
              "数据已在库里面，不存——————————————————————————",
              item.wareId
            );
          }
        });
      }
    };
    const sendAjax = async (categoryId, pageNum = 1, pageCount = 1) => {
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
      let count = 1;
      // 如果pageNum > pageCount  那么代表请求完毕，直接跳出
      if (pageNum > pageCount) {
        return null;
      } else {
        await delay(10);
        try {
          dataJson.categoryId = categoryId;
          dataJson.pageNum = pageNum;
          const data = await axios.post(baseUrl + "wareSearch", {
            param: JSON.stringify(dataJson)
          });
          const { wareList, pageInfo } = data.data.data;
          pageCount = pageInfo.pageCount;
          if (count <= 3) {
            // console.log(dataJson);
            console.log("dataJson.pageNum is", dataJson.pageNum);
            console.log("pageNum is", pageNum);
            // console.log("p90-------", wareList);
            // console.log("p91-------", pageInfo);
          }
          // console.log("p104-------", count);
          count++;
          saveDB(wareList);

          if (pageNum < pageCount) {
            pageNum++;
            console.log("pageNum is", pageNum);
            console.log("pageCount is", pageCount);
            sendAjax(categoryId, pageNum, pageCount);
          }
        } catch {
          throw new Error(
            "请求ajax数据出错,categoryId is ",
            dataJson.categoryId
          );
        }
      }
    };

    const httpGet = async commodityArray => {
      let count = 1;
      commodityArray.forEach(async item => {
        // dataJson.categoryId = item;
        // let pageCount = 1;
        // let pageNum =1
        // for (; pageNum <= pageCount; ) {
        // console.log("这是一次循环pageCount is", pageCount);
        // dataJson.pageNum = pageNum++;
        await delay(1000);
        console.log(`遍历commodity----------这是第${count}遍`);
        sendAjax(item);
        // function()
        // }
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

  async find(ctx) {
    const { per_page = 20 } = ctx.query;
    const page = Math.max(ctx.query.page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    ctx.body = await Commodity.find({ wareName: new RegExp(ctx.query.q) })
      .limit(perPage)
      .skip(page * perPage);
  }
}

module.exports = new commodityCtl();
