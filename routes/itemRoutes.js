const express = require("express");
const SubCategory = require("../models/SubCategory");
const Category = require("../models/Category"); // Add Category model
const Item = require("../models/Item");

const router = express.Router();

// Create Item
router.post("/", async (req, res) => {
  try {
    const { name, price, categoryId, subCategoryId } = req.body;
    console.log(req.body);

    // Validate required categoryId
    if (!categoryId) {
      return res.status(400).json({ error: "Category ID is required" });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Validate subCategoryId if provided
    if (subCategoryId) {
      const subCategory = await SubCategory.findById(subCategoryId);
      if (!subCategory) {
        return res.status(404).json({ error: "SubCategory not found" });
      }
      // Optional: Ensure subCategory belongs to the provided category
      if (subCategory.category.toString() !== categoryId) {
        return res.status(400).json({ error: "SubCategory does not belong to the specified Category" });
      }
    }

    // Create the item
    const item = new Item({
      name,
      price,
      category: categoryId, // Required
      subCategory: subCategoryId || null, // Optional
      isAvailable: true
    });
    await item.save();

    // If subCategoryId is provided, update SubCategory's items array
    if (subCategoryId) {
      await SubCategory.findByIdAndUpdate(subCategoryId, { $push: { items: item._id } });
    }

    // Optional: Update Category's items array if you add an items field to CategorySchema
    // await Category.findByIdAndUpdate(categoryId, { $push: { items: item._id } });

    res.status(201).json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Update an existing item
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId, subCategoryId, isAvailable } = req.body;

    // If categoryId is provided, validate it
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    // If subCategoryId is provided, validate it
    if (subCategoryId) {
      const subCategory = await SubCategory.findById(subCategoryId);
      if (!subCategory) {
        return res.status(404).json({ error: "SubCategory not found" });
      }
      // Optional: Ensure subCategory matches the category (if both provided)
      if (categoryId && subCategory.category.toString() !== categoryId) {
        return res.status(400).json({ error: "SubCategory does not belong to the specified Category" });
      }
    }

    const updatedData = {
      name,
      price,
      category: categoryId,
      subCategory: subCategoryId || null,
      isAvailable
    };

    const item = await Item.findByIdAndUpdate(id, updatedData, { new: true });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // If subCategory changed, update the SubCategory's items array (remove from old, add to new)
    if (subCategoryId && item.subCategory && subCategoryId !== item.subCategory.toString()) {
      await SubCategory.findByIdAndUpdate(item.subCategory, { $pull: { items: item._id } });
      await SubCategory.findByIdAndUpdate(subCategoryId, { $push: { items: item._id } });
    } else if (!subCategoryId && item.subCategory) {
      await SubCategory.findByIdAndUpdate(item.subCategory, { $pull: { items: item._id } });
    } else if (subCategoryId && !item.subCategory) {
      await SubCategory.findByIdAndUpdate(subCategoryId, { $push: { items: item._id } });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Remove the item from its SubCategory's items array (if it had one)
    if (item.subCategory) {
      await SubCategory.findByIdAndUpdate(item.subCategory, { $pull: { items: item._id } });
    }

    // Optional: Remove from Category's items array if you add an items field to CategorySchema
    // await Category.findByIdAndUpdate(item.category, { $pull: { items: item._id } });

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;