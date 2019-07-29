const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const storeSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String },
  locations: {
    type: [{ type: Schema.Types.ObjectId, ref: "Location" }], select: false
  },

})
module.exports = model("Store", storeSchema);