import Router from 'koa-router'
import Redis from "koa-redis"
import nodemailer from 'nodemailer'
import Employee from '../dbs/models/employee'
import Passport from './utils/passport'
import Email from '../dbs/config'
import axios from 'axios';

let router = new Router(
  {
    prefix:'/employee'
  }
)

let Store =new Redis().client
router.post('/',async(ctx)=>{
  console.log("进来了")
  ctx.body={
    msg:123
  }
})
// 注册
router.post('/register',async (ctx,next) =>{
  // console.log(ctx.header)
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body;
  console.log(`?????`)
  if(code){
    const saveCode = await Store.hget(`nodemail:${username}`,'code')
    const saveExpire = await Store.hget(`nodemail:${username}`,'expire')
    if(code === saveCode){
      if(new Date().getTime() - saveExpire >0){
        ctx.body = {
          code: -1,
          msg:"验证码已经过期，重新尝试"
        }
        return false
      } else {
        ctx.body = {
          code: -1,
          msg : "请填写正确的验证码"
        }
      }
    }else{
      ctx.body={
        code:-1,
        msg:"请填写验证码"
      }
    }
    let employee = await Employee.find({
      username
    })
    if(employee.length){
      ctx.body ={
        code: -1,
        msg:"已被注册"
      } 
      return
    }
    let nemployee = await Employee.create({
      username,
      password,
      email
    })
    if(nemployee){
      let res = await axios.post('./employee/register',{
        username,
        password
      })
      if(res.data&&res.data.code===0){
        ctx.body={
          code:0,
          msg:"注册成功",
          user:res.data.user
        }
      }else{
        ctx.body={
          code:-1,
          msg:'error'
        }
      }
    }else{
      ctx.body={
        code:-1,
        msg:'注册失败'
      }
    }
  }else{
    ctx.body ={
      code: -1,
      msg:"你没输入验证码"
    } 
    return
  }
})
//登录
router.post('/login',async(ctx,next) =>{
  console.log(ctx.header)
  return Passport.authenticate('local',function (err,user,info,status) {
      if(err){
        ctx.body={
          code:-1,
          msg:err
        }
      }else{
        if(user){
          ctx.body={
            code:0,
            msg:'登陆成功',
            user
          }
          return ctx.logIn(user)
        }else{
          ctx.body={
            code:1,
            msg:info
          }
        }
      }
    })(ctx,next)
})

router.post('/verify',async(ctx,next)=>{
  let username = ctx.request.body.username
  console.log(111111111111111111);
  console.log(ctx.request.body);

  const saveExpire = await Store.hget(`nodemail:${username}`,'expire')

  console.log(`saveExpire is ${saveExpire}`)
  if(saveExpire && new Date().getTime() - saveExpire <0){
    console.log(`date.gettime is ${new Date().getTime()}`);
    console.log(`saveExpires  is ${saveExpire}`);
    
    ctx.body ={
      code:-1,
      msg:'验证请求过于频繁，请于1分钟之后再次尝试'
    }
    return false
  }else{
    ctx.body ={
      code:-1,
      msg:'莫名其妙的问题'
    }
  }

  let transporter =nodemailer.createTransport({
    service:'qq',
    auth:{
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })

  let ko = {
    code : Email.smtp.code(),
    expire:Email.smtp.expire(),
    email:ctx.request.body.email,
    user:ctx.request.body.username
  }
  
  let mailOptions = {
    from:`"认证邮件" <${Email.smtp.user}>`,
    to:ko.email,
    subject:'《杨二狗连锁超市》注册码',
    html:`您在《杨二狗连锁超市中》注册，您的注册码是${ko.code}，请在一分钟之内填写，如不是您本人，请联系杨二狗18610090645`
  }
  await transporter.sendMail(mailOptions,(error,info) =>{
    if(error) {
      
      return console.log(error)
    }else {
      Store.hmset(`nodemail:${ko.user}`,'code',ko.code,'expire',ko.expire,'email',ko.email)
    }
  })
  ctx.body={
    code:0,
    msg:'验证码已经发送，有效期为一分钟'
  }
})

router.get('/exit',async (ctx,next) =>{
  await ctx.logout()
  if(!ctx.isAuthenticated()){
    ctx.body ={
      code:0
    }
  }else{
    ctx.body ={
      code:-1
    }
  }
})

router.get('/getUser',async(ctx) =>{
  if(ctx.isAuthenticated()){
    const {username,email} =ctx.session.passport.user
    ctx.body ={
      user:username,
      email
    }
  }else{
    ctx.body = {
      user:'',
      email:''
    }
  }
})
export default router