export default{
  dbs:"mongodb://39.107.68.213:27000/react",
  redis:{
    get host(){
      return "127.0.0.1"
    },
    get port(){
      return 6379
    }
  },
  smtp:{
    get host(){
      return 'smtp.qq.com'
    },
    get user(){
      // return '2474329308@qq.com'
      return '1037796421@qq.com'
    //  我的这个QQ号，密码是 LDYldy1037796421
    },
    get pass(){
      // return 'tegsgnlmcekddjba'  //2开头的qq号吗
      return 'ehjtmghvxenrbdad'

    },
    get code(){
      return () =>{
        return Math.random().toString(16).slice(2,6).toUpperCase()
      }
    },
    get expire(){
      return () =>{
        return new Date().getTime()+ 60*1000
      }
    }
  },


}