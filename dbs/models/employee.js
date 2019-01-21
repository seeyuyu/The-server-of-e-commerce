import mongoose from 'mongoose'
const Schema =mongoose.Schema
const EmployeeSchema =new Schema({
  username:{
    type:String,
    unique:true,
    require:true
  },
  password:{
    type:String,
    require:true
  },
  email:{
    type:String,
    require:true
  }
})
export default mongoose.model('Employee',EmployeeSchema,'employee')