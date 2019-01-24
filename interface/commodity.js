import Router from 'koa-router'
import Redis from 'koa-redis'
import Commodity from '../dbs/models/commodity'


let router = new Router({
  prefix:'/commodity'
})
let Store = new Redis().client
router.post('/',async(ctx)=>{
  console.log("进来了")
  console.log("post----------------------------------")
  console.log(ctx.request.body);
  console.log("**********************************")
  ctx.body={
    msg:'post'
  }
})
router.delete('/',async(ctx)=>{
  console.log("进来了")
  console.log("delete----------------------------------")
  console.log(ctx.request.body);
  console.log("**********************************")
  ctx.body={
    msg:'delete'
  }
})
router.put('/',async(ctx)=>{
  console.log("进来了")
  console.log("put----------------------------------")
  console.log(ctx.request.body);
  console.log("**********************************")
  ctx.body={
    msg:'put'
  }
})
router.get('/',async(ctx)=>{
  console.log("进来了")
  console.log("get----------------------------------")
  console.log(ctx.request.body);
  console.log("**********************************")
  ctx.body={
    msg:'get'
  }
})
// 
export default router
