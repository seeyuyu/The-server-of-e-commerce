const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const locationSchema = new Schema({
  __v: { type: Number, select: false }
});
module.exports = model("Location", locationSchema);
