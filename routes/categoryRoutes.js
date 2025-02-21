const express = require("express");
const Category = require("../models/Category");
const Item = require("../models/Item"); // Assuming you have an Item model

const router = express.Router();

// Create Category
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Menu (Categories with Subcategories and Items)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().populate({
      path: "subCategories",
      populate: { path: "items" }
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an existing item
router.put("/item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const item = await Item.findByIdAndUpdate(id, updatedData, { new: true });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an existing item
router.delete("/item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Make an item unavailable
router.patch("/item/:id/unavailable", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndUpdate(id, { available: false }, { new: true });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


module.exports = router;
