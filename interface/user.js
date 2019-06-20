import Router from 'koa-router'
import Redis from "koa-redis"
import nodemailer from 'nodemailer'
import User from '../dbs/models/user'
import Passport from './utils/passport'
import Email from '../dbs/config'
import axios from 'axios';
const errorRes =(err) =>{
  this.ctx.body ={
    code:-1,
    msg:err,
  }
}
const successRes = ({res='success'},...items) =>{
  this.ctx.body ={
    code: 0,
    msg:res,
    data:items,
  }
};
const infoRes = (res)=>{
  this.ctx.body ={
    code:1,
    msg:res,
  }
}
let router = new Router({
  prefix:'/user',
})
let Store = new Redis().client
//测试的接口哦
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

  const saveExpire = await Store.hget(`userNodeMail:${userName}`,'expire');
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
      pass: Email.smtp.pass
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

      ctx.body ={
        code:-1,
        meg:'异常，请联系开发人员'
      }
      console.log(error);
      console.log(info)
      console.log('70行出问题了')
      throw new Error(error);

    }else{
      Store.hmset(`userNodeMail:${ko.user}`,'code',ko.code,'expire',ko.expire,'email',ko.email)

    }
    ctx.body ={
      code:0,
      meg:'验证码已经发送，有效期为一分钟'
    }
  })
})

//用户注册
router.post('/register',async(ctx,next) =>{
  const {userName,passWord,email,code,} = ctx.request.body;
  console.log('user/register comming -------------------------------------------------------');
  if(!userName||!passWord||!email||!code){
    console.log('参数不全');
    ctx.body ={
      code:-1,
      msg:'请填写完整参数',
    }
    return false
  }
    const saveCode = await Store.hget(`userNodeMail:${userName}`,'code')
    const saveExpire = await Store.hget(`userNodeMail:${userName}`,'expire');

    if(code == saveCode){
      if(new Date().getTime() - saveExpire > 0){
        ctx.body ={
          code: -1,
          msg: '验证码已经过期，请重新尝试',
        }
        return false
      }
    }


    let user = await User.find({userName})
    console.log('找到了库里面的user is ',user)
    if(user.length){
      ctx.body={
        code:-1,
        msg:'您的名字已经被注册'
      }
      return false
    }

    let nuser = await User.create({
      userName,userPwd:passWord,userEmail:email,
    })

    if(nuser){
      console.log('此处创建成功后，发生了什么事情')
      let res = await axios.post('http://127.0.0.1:8081/user/register',{
        userName,passWord,
      }).then(res =>{
        console.log(res)
      },err =>{
        console.log(err);
      })

      if(res.data&&res.data.code==0){
        ctx.body = {
          code:0,
          msg:'注册成功',
          user:res.data.user,
        }
      }else {
        ctx.body={
          code:-1,
          msg:"请求失败此处",
        }
      }
    }else {
      ctx.body={
        code:-1,
        msg:"创建数据库失败",
      }
    }

})

//用户登录
router.post('/login',async(ctx,next) =>{
  return Passport.authenticate('local',(err,user,info,status) =>{
    if(err){
      errorRes(err)
    }else {
      if(user){
        successRes({},user);
        return ctx.logIn(user); //?这个大小写是不是有问题
      }else {
        infoRes(info);
      }

    }
  })(ctx,next)
})

//用户登出
router.post('exit',async(ctx,next) =>{
  await ctx.logout()
  if(!ctx.isAuthenticated()){
    successRes({});
  }else {
    errorRes();
  }
})

router.get('/getUser',async(ctx) =>{
  if(ctx.isAuthenticated()){
    const {username,email} =ctx.session.passport.user
    successRes({},{user:username},email)
  }else {
    successRes({},{user:''},{email:''});
  }
})
export  default  router

