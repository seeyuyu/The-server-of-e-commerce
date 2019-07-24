const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const mongoose = require('mongoose');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const Redis = require('koa-redis') 
const session =require('koa-generic-session')
const routing = require('./routes');
const error = require('koa-json-error');
import dbConfig from './dbs/config'

import cors from 'koa2-cors'
// error handler
onerror(app);
// app.use(cors({
//   origin:'http://localhost:3001',
//   credentials:true,
// }))

console.log('123123132313')

app.keys = ['syy','keyskeys']
app.proxy =true;
app.use(session({
  key:'syy',
    prefix:'syy:uid',
  store: new Redis(),
    domain:'/127.0.0.1',
}))

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

// 配置路由登录表 
app.use(json())

mongoose.connect(dbConfig.dbs,{
  useNewUrlParser:true
},(err) =>{
  if(err){
    console.log('mongodb connect error',err);
  }else {
    console.log('mongodb connect success ! ');
  }
})
// 处理登录相关的

// app.use(passport.initialize());
// app.use(passport.session());
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use( async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
})

// routes
routing(app);

// error-handling
app.use(error({
  postFormat:(e,{stact, ...rest}) =>{
    process.env.NODE_ENV ==='production'?rest:{stack, ...rest}
  }
}))
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
