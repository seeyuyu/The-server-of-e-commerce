const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const locationSchema = new Schema({

  __v: { type: Number, select: false },
  province: { type: Number, default: 0 },
  city: { type: Number, default: 0 },
  area: { type: Number, default: 0 },
  address: { type: String, default: "" }

})
module.exports = model("Location", locationSchema);

