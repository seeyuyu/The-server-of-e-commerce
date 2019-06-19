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
    type:[
      {
        receiverName:{type:String,require:true},
        receiverTel:{type:String,require:true},
        receiverEmail:{type:String,require:true},
        sheng:{type:String,require:true},
        shi:{type:String,require:true},
        qu:{type:String,require:true},
        detail:{type:String,require:true},     //具体门派号码
        isDefault:{type:Boolean},              //是否是默认地址
      }
    ],
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