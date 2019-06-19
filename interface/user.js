import Router from 'koa-router'
import Redis from "koa-redis"
import nodemailer from 'nodemailer'
import User from '../dbs/models/user'
import Passport from './utils/passport'
import Email from '../dbs/config'
import axios from 'axios';

let router = new Router({
  prefix:'/user',
})
let Store = new Redis().client

router.post('/',async(ctx) =>{
  console.log('user路由进来了');
  ctx.body={
    msg:'success in user'
  }
})

//发送验证码
router.post('/verify',async(ctx,next) =>{
  let userName = ctx.request.body.userName;
  console.log('user verify is coming');
  console.log(ctx.request.body);

  const saveExpire = await Store.hget(`userMail:${userName}`,'expire');
  console.log(`saveExpire is `,saveExpire);
  if(saveExpire && new Date().getTime() - saveExpire < 0){
    console.log(`date.gettime is ${new Date().getTime()}`);
    console.log(`saveExpires  is ${saveExpire}`);
    ctx.body ={
      code: -1,
      msg:"验证过于频繁，请于1分钟之后再试",
    }
    return false
  }else {
    ctx.body={
      code:-1,
      msg:'出问题？？？'
    }
  }
  //调用邮件服务
  let transporter = nodemailer.createTransport({
    service:'qq',
    auth:{
      user: Email.smtp.user,
      pass: Email.smtp.pass,
    }
  })
  const ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.userName,
  }
  let mailOptions = {
    from:`"认证邮件" <${Email.smtp.user}>`,
    to:ko.email,
    subject:'《杨二狗网上超市》注册码',
    html:`您的注册码是${ko.code},请在一分钟之内填写`
  }
  await transporter.sendMail(mailOptions,(error,info) =>{
    if(error){
      console.log(error);
      console.log(info)
      ctx.body ={
        code:-1,
        meg:'异常，请联系开发人员'
      }
      console.log('70行出问题了')
      throw new Error(error);

    }else{
      Store.hmset(`userMail:${ko.user}`,'code',ko.code,'expire',ko.expire,'email',ko.email)
      ctx.body ={
        code:0,
        meg:'验证码已经发送，有效期为一分钟'
      }
    }
  })
})

//用户注册
router.post('/register',async(ctx,next) =>{
  const {userName,passWord,eamil,code,} = ctx.require.body;
  console.log('user/register comming');
  if(code){
    const saveCode = await Store.hget(`userNodemail:${username}`,code)
  }
})

export  default  router

