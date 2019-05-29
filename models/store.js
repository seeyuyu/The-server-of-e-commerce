const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const storeSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String },
  avatar_url: { type: String },
  locations: {
    type: [
      {
        province: { type: Number, default: 0 },
        city: { type: Number, default: 0 },
        area: { type: Number, default: 0 },
        address: { type: String, default: "" }
      }
    ],
    select: false
  },
  
});
module.exports = model("Store", storeSchema);
