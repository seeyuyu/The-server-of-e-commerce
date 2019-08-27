const Commodity = require("../models/commoditys");
const List = require("../models/lists");

// const { List, Commodity } = require("../models/dbs");
const searchDataUrl = "./public/searchData";
const axios = require("axios");
const fs = require("fs");
const { delay } = require("../public/utils");
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
  async getFromJson(ctx) {
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

  async getFromOnline(ctx) {
    let count = 0;
    const baseUrl = `http://searchgw.dmall.com/mp/search/`;
    // const delay = time => {
    //   return new Promise(function(resolve, reject) {
    //     setTimeout(function() {
    //       resolve();
    //     }, time);
    //   });
    // };
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
      // 如果是个是个对象，不是个数组，那就把它变成数组
      if (!Array.isArray(wareList) && typeof wareList == "object") {
        wareList = [].concat(wareList);
      }
      await wareList.forEach(async item => {
        // console.log(" p97---------------item.wareId is ", item.wareId);
        if (await Commodity.findOne({ wareId: item.wareId })) {
          ctx.throw(409, `数据已在库里面，不存${item.wareId}`);
        }
        try {
          const data = await new Commodity(item).save();
          console.log(
            "存储成功之后          当前数据总量是————————————————",
            await Commodity.count()
          );
          ctx.body = data;
        } catch {
          ctx.throw(400, `存库出错了", ${item.wareId}`);
          throw new Error("存库出错了----------", item.wareId);
        }
      });
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
    await delay(2000);
    ctx.body = await Commodity.find({ wareName: new RegExp(ctx.query.q) })
      .limit(perPage)
      .skip(page * perPage);
  }
  // 入库以后，主键应该变为了Object-id，而不是categoryId
  async create(ctx) {
    ctx.verifyParams({
      collageTagPreSell: { type: Boolean, default: false },
      cornerMarkImgList: { type: Array, default: [] },
      mainFirstCmCat: { type: Number, select: false }, //新增
      mainSecondCmCat: { type: Number, required: true },
      mainThirdCmCat: { type: Number, select: false }, //新增 暂时不用 移动端抓包抓不到
      brandId: { type: Number, select: false, required: true }, //新增 暂时不用 移动端抓包抓不到
      monthSales: { type: String },
      offlinePrice: { type: Number },
      onlinePrice: { type: Number },
      onlinePromotionPrice: { type: Number },
      priceDisplay: { type: String },
      promoting: { type: String },
      promotionWare: { type: Boolean },
      resultData: { type: String },
      resultType: { type: Number },
      searchRecTitle: { type: String },
      sell: { type: Boolean },
      sku: { type: String },
      skuTagDataList: { type: Array },
      status: { type: String },
      storeId: { type: Number },
      suitPromotionWareVO: { type: String },
      tagPreSell: { type: Boolean },
      venderId: { type: Number },
      wareDetailImgList: { type: Array },
      wareId: { type: String },
      wareImg: { type: String, required: true },
      wareName: { type: String, required: true },
      warePrice: { type: String, required: true },
      wareStatus: { type: Number },
      wareType: { type: String },
      promotionWareVO: { type: Object }
    });
    const { wareName } = ctx.request.body;
    const newCommodity = await Commodity.findOne({ wareName });
    if (newCommodity) {
      ctx.throw(409, "货物名字已经被使用");
    }
    const commodity = await new Commodity(ctx.request.body).save();
    ctx.body = commodity;
  }
  async updata(ctx) {
    console.log("进入了updata接口");
    ctx.verifyParams({
      collageTagPreSell: { type: Boolean, default: false },
      cornerMarkImgList: { type: Array, default: [] },
      mainFirstCmCat: { type: Number, select: false }, //新增
      mainSecondCmCat: { type: Number, required: true },
      mainThirdCmCat: { type: Number, select: false }, //新增 暂时不用 移动端抓包抓不到
      brandId: { type: Number, select: false, required: true }, //新增 暂时不用 移动端抓包抓不到
      monthSales: { type: String },
      offlinePrice: { type: Number },
      onlinePrice: { type: Number },
      onlinePromotionPrice: { type: Number },
      priceDisplay: { type: String },
      promoting: { type: String },
      promotionWare: { type: Boolean },
      resultData: { type: String },
      resultType: { type: Number },
      searchRecTitle: { type: String },
      sell: { type: Boolean },
      sku: { type: String },
      skuTagDataList: { type: Array },
      status: { type: String },
      storeId: { type: Number },
      suitPromotionWareVO: { type: String },
      tagPreSell: { type: Boolean },
      venderId: { type: Number },
      wareDetailImgList: { type: Array },
      wareId: { type: String },
      wareImg: { type: String, required: true },
      wareName: { type: String, required: true },
      warePrice: { type: String, required: true },
      wareStatus: { type: Number },
      wareType: { type: String },
      promotionWareVO: { type: Object }
    });
    const commodity = await Commodity.findById(ctx.request._id);
    if (commodity) {
      ctx.throw(404, `商品不存在`);
    }
    const newCommodity = await Commodity.updateOne(
      { _id: ctx.request.id },
      ctx.request.body
    );
    ctx.body = newCommodity;
  }
  async delete(ctx) {
    const commodity = await Commodity.findById(ctx.request._id);
    if (commodity) {
      ctx.throw(404, `商品不存在`);
    }
    //这里应该找一个属性，保存商品的状态，不能删除，防止影响订单
    // commodity.status = false
    ctx.statsu = 204;
  }

  // 请求详情的接口
  async getDetailFromOnline(ctx) {
    // const delay = time => {
    //   return new Promise(function(resolve, reject) {
    //     setTimeout(function() {
    //       resolve();
    //     }, time);
    //   });
    // };

    const sendAjax = async sku => {
      const dataJson = {
        storeId: "15865",
        skuId: "100929564",
        moduleCodes: "slider,warebase,shipment,store,recommend,description",
        longitude: 116.458083,
        latitude: 39.996402
      };
      try {
        dataJson.skuId = sku;
        // console.log(dataJson);
        const data = await axios.post(
          `http://detail.dmall.com/waredetail/main`,
          {
            param: `${JSON.stringify(dataJson)}`,
            source: 2
          }
        );
        console.log("data.data.data  is ++++", data.data.code);
        if (data.data.code === "0000") {
          // console.log(data.data.data.moduleList);
          return data.data.data.moduleList;
        }
        return null;
      } catch {
        throw new Error("请求ajax数据出错,skuId is ", dataJson.skuId);
      }
    };

    const saveDetail = async (moduleList, sku) => {
      try {
        const Lists = await Commodity.findOne({ sku });
        if (!Lists) {
          console.log(`库里没存这一条数据${sku}`);
          return;
        }
        // console.log("Lists is -----", Lists);
        // console.log("moduleList is -------", moduleList);

        moduleList.map(item => {
          switch (item.moduleName) {
            case "slider": {
              // console.log(`item.data.cornerSign ++= `,item.data.cornerSign)
              Lists.cornerSign = item.data.cornerSign || [];
              // console.log(`Lists.cornerSign ++ =`, Lists.cornerSign)

              Lists.wareImgList =
                item.data.wareImgList ||
                item.data.wareImgListNew.filter(item => {
                  return item == "url";
                });
              // console.log('Lists.wareImgList    ',Array.isArray(Lists.wareImgList))
              break;
            }
            case "warebase": {
              Lists.brandId = item.data.brandId;
              Lists.warebaseKeyword = item.data.keyword;
              // console.log('Lists.brandId   ',Lists.brandId)
              // console.log('Lists.warebaseKeyword   ',Lists.warebaseKeyword)
              break;
            }
            case "shipment": {
              Lists.shipmentTimeTip = item.data.shipmentTimeTip;
              // console.log(`Lists.shipmentTimeTip`, Lists.shipmentTimeTip);
              break;
            }
            case "store": {
              Lists.storeName = item.data.storeName;
              Lists.storeLogo = item.data.storeLogo;
              // console.log(`Lists.storeName   `,Lists.storeName)
              // console.log(`Lists.storeLogo   `,Lists.storeLogo)

              break;
            }
            case "recommend": {
              // console.log(
              //   `item.data.referenceWareList   `,
              //   item.data.referenceWareList
              // );
              if (!item.data.referenceWareList) {
                return;
              }
              const temp = item.data.referenceWareList.map(item => {
                return item.skuId;
              });
              // console.log("temp----", temp);
              Lists.referenceWareList = temp.map(async item => {
                let id = await Commodity.findOne({ sku: item });
                // console.log(id)
                // console.log("反查出来的数据",await Commodity.findById(id))
                return id;
              });
              Lists.referenceWareList = item.data.referenceWareList.filter(
                item => {
                  return item.skuId;
                }
              );
              // console.log(
              //   `Lists.referenceWareList is  -----`,
              //   Lists.referenceWareList
              // );
              break;
            }
            case "description": {
              // console.log(item.data.description)
              Lists.wareDetailImgList = item.data.description
                .split('img src="')
                .map(item => {
                  if (item.indexOf("http") > -1) {
                    // console.log(item.indexOf("alt"));
                    // console.log(item.substr(0, item.indexOf("alt") - 2));
                    return item.substr(0, item.indexOf("alt") - 2);
                  }
                })
                .filter(item => {
                  return item;
                });
              // console.log(`Lists.wareDetailImgList is  ++ %%%%  ++`, Lists.wareDetailImgList);
              break;
            }
            default:
              "switch出问题了";
          }
        });
        try {
          let result = await Commodity.updateOne({ _id: Lists._id }, Lists);
          // console.log("result is ************* ", result);
          // console
          //   .log("更新后的lists", await Commodity.findById(Lists._id).select("brandId"))
        } catch {
          throw new Error("lists更新出错了");
        }
        // console.log(`更新后的Lists is`, Lists);
        // 如果有重复数据，只修改第一条，其他的待会删掉，写一个方法，如果没有详情的算是无效数据，remove掉
      } catch {
        throw new Error(`找sku----${sku}---为的数据报错`);
      }
    };

    const httpSend = async skuIdLists => {
      if (!Array.isArray(skuIdLists)) {
        skuIdLists = [].concat({ sku: skuIdLists });
        console.log("skuIdLists is", skuIdLists);
      }
      skuIdLists.forEach(async item => {
        await delay(100);
        console.log("item.sku", item.sku);

        const moduleList = await sendAjax(item.sku);
        if (!moduleList) {
          return;
        }
        // console.log("moduleList is ------", moduleList);
        // 拿sku遍历，肯定能找到两条数据，那么我们顺便删除一条数据
        await saveDetail(moduleList, item.sku);
      });
    };

    // httpSend(100308803);

    try {
      const skuIdLists = await Commodity.find({});
      if (!skuIdLists) {
        console.log("没有数据");
        return;
      }
      console.log(Array.isArray(skuIdLists));
      // console.log(await Commodity.count());
      // console.log(skuIdLists);
      await httpSend(skuIdLists);
    } catch {
      throw new Error("什么鬼");
    }
  }
}
module.exports = new commodityCtl();
