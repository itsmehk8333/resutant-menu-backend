const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true , required: false},
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }
});

module.exports = mongoose.model("Item", ItemSchema);
