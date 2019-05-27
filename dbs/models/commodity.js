//目前的商品表格
import mongoose from 'mongoose'
const Schema =mongoose.Schema
const CommoditySchema =new Schema({
  title:{
    type:String,
    unique:true,
    require:true
  },
  text:{
    type:String,
    require:true
  },
  amount:{
    type:String,
    require:true
  },
  newprice:{
    type:Number,
    required:true
  },
  originalprice:{
    type:Number,
    required:true
  },
  image:{
    type:Array,
    required:false
  }
})
export default mongoose.model('Commodity',CommoditySchema,'commodity')