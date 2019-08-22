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
    if(commodity){
      ctx.throw(404,`商品不存在`);
    }
    //这里应该找一个属性，保存商品的状态，不能删除，防止影响订单
    // commodity.status = false
    ctx.statsu =204;
  }
}
module.exports = new commodityCtl();
