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
const index = require('./routes/index');
const users = require('./routes/users');
const firstPage =require('./routes/firstPage');
import dbConfig from './dbs/config'

import passport from './interface/utils/passport'
import employee from './interface/employee'
// error handler
onerror(app)

console.log('123123132313')
app.keys = ['syy','keyskeys']
app.proxy =true;
app.use(session({
  key:'syy',
  prefix:'see:uid',
  store: new Redis() 
}))
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

// 配置路由登录表 

app.use(json())
mongoose.connect(dbConfig.dbs,{
  useNewUrlParser:true
})
app.use(passport.initialize());
app.use(passport.session());
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
// app.use(firstPage.routes(), firstPage.allowedMethods())
app.use(employee.routes()).use(employee.allowedMethods())

// error-handling

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
