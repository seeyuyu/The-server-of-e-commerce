const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: Number, required: true },
  password: { type: String, required: true },
  gender: { type: String, required: true, enum: ["male", "female"], default: "male"},
  avatar_url:{ type:String}
});
