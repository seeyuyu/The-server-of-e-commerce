//目前的商品表格
import mongoose from 'mongoose'
const Schema =mongoose.Schema
const UserSchema =new Schema({
  userName:{
    type:String,
    require:true
  },
  userPwd:{
    type:String,
    require:true
  },
  userEmail:{
    type:String,
    require:true
  },
  userAddress:{
    type:Array,
    required:false
  },
  userShopCart:{
    type:Array,
    required:false
  },
  userOrder:{
    type:Array,
    required:false
  }
})
export default mongoose.model('User',UserSchema,'user')