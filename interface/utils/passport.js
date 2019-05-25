import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import EmployeeModel from '../../dbs/models/employee'
passport.use(new LocalStrategy(async function (username,password,done) {
  let where = {
    username
  }
  console.log(`username is ${username}`)
  let result = await EmployeeModel.findOne(where);
  console.log(`result.password is ${result}`);
  console.log(`password is ${password}`)
  if(result!=null){
    if(result.password === password){
      return done(null,result)
    }else{
      return done(null,false,"密码错误")
    }
  
  }else{
    return done(null, false,"用户不存在")
  }

}))
// 序列化,在用户登录验证成功以后将会把用户的数据存储到 session 中
passport.serializeUser(function(user,done){
  done(null,user)  

})
// 反序列化,在每次请求的时候将从 session 中读取用户对象
passport.deserializeUser(function(user,done){
  return done(null,user)
})
export default passport