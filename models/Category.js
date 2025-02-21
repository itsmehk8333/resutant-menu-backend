const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }]
});

module.exports = mongoose.model("Category", CategorySchema);
