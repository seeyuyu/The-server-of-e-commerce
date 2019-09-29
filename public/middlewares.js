const jwt = require("koa-jwt");
const { secret } = require("../config/development");
const User = require("../models/users")
// const Commodity = require("../models/commoditys");
const Commodity = require("../models/commoditys");
class middleware {
  constructor() {
    this.auth = jwt({ secret });
  }

  // 给collect和购物车 准备的，公共的find和delete方法 ----start
  async find (ctx) {
    console.log('我是中间件')
    let url = ctx.request.url.substr(1)
    url = url.replace('-', '_')
    if (url == "collection") {
      url = 'collect'
    }
  
    const data = await User.findById(ctx.state.user._id).select(url)
    // console.log("data.url is -----", data[url]);
    // 用来保存要返回的值
    let response = []
    for (let item of data[url]) {
      console.log('before item  is ', item)
      let value = await Commodity.findById(item.commodity_id)
      const { mainSecondCmCat, sku, wareId, wareImg, wareName, warePrice, _id } = value
      console.log('value is', value)
      const { amount, } = item
      const arr = {
        _id, mainSecondCmCat, sku, wareId, wareImg, wareName, warePrice, amount,
      }
      response.push(arr)
    }
    console.log("response is -----", response);
    ctx.body = response
  }


  async delete (ctx) {

    // let arr = /^\/\S+\/$/.match(ctx.request.url)

    // console.log(arr)
    let url = ctx.request.url.match(/^\/\D+\//)[0].replace(/\//g, '')
    console.log(url)
    // console.log(ctx.request.url);
    console.log('hh')

    if (url == "collection") {
      url = 'collect'
    }
    url = url.replace('-', '_')
    console.log(url)
    try {
      const data = await User.findById(ctx.state.user._id).select(
        url
      )
      console.log('data[url]  --- ', data[url])

      ctx.params.id.split(';').filter(e => e).map(item => {
        data[url] = data[url].filter(list => {
          // console.log('item is ---------------------',item)
          // console.log('list.commodity_id is ------- ',list.commodity_id)
          return item != list._id
        })
      })

      console.log('data[url]  +++ ', data[url])
      console.log('data==========', data)

      try {
        const body = await User.updateOne({ _id: ctx.state.user._id }, data);
        ctx.body = body
      } catch (e) {
        ctx.throw(500, e);
      }
    } catch (e) {
      ctx.throw(500, e)
    }

  }
  // 给collect和收藏夹准备的，公共的find和delete方法 ----end
  async checkCommodity(ctx,next){
    const data = await Commodity.findById(ctx.request.body._id)
    if(data){
      console.log('data is ',data)
      await next()
    }else{
      ctx.throw(404,'商品不存在') 
    }
  }
}
module.exports = new middleware();
