const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // New required field
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: false },// Still optional
  Grub: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Item", ItemSchema);