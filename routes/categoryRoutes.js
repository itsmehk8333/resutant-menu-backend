const express = require("express");
const Category = require("../models/Category");
const Item = require("../models/Item"); // Assuming you have an Item model
const SubCategory = require("../models/SubCategory");

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

router.get("/", async (req, res) => {
  try {
    // Fetch all categories
    const categories = await Category.find();

    // Fetch all items and populate their subCategory (if any)
    const items = await Item.find().populate("subCategory");

    // Build the response structure
    const result = await Promise.all(
      categories.map(async (category) => {
        // Get all items for this category
        const categoryItems = items.filter(
          (item) => item.category.toString() === category._id.toString()
        );

        // Separate items with and without subcategories
        const itemsWithoutSubCategory = categoryItems
          .filter((item) => !item.subCategory)
          .map((item) => ({
            _id: item._id,
            name: item.name,
            price: item.price,
            isAvailable: item.isAvailable
          }));

        // Group items by subcategory
        const subCategoryItems = {};
        categoryItems
          .filter((item) => item.subCategory)
          .forEach((item) => {
            const subCatId = item.subCategory._id.toString();
            if (!subCategoryItems[subCatId]) {
              subCategoryItems[subCatId] = {
                _id: item.subCategory._id,
                name: item.subCategory.name,
                items: []
              };
            }
            subCategoryItems[subCatId].items.push({
              _id: item._id,
              name: item.name,
              price: item.price,
              isAvailable: item.isAvailable
            });
          });

        // Fetch subcategories for this category to ensure we include empty ones
        const subCategories = await SubCategory.find({ category: category._id });
        subCategories.forEach((subCat) => {
          const subCatId = subCat._id.toString();
          if (!subCategoryItems[subCatId]) {
            subCategoryItems[subCatId] = {
              _id: subCat._id,
              name: subCat.name,
              items: []
            };
          }
        });

        return {
          _id: category._id,
          name: category.name,
          subCategories: Object.values(subCategoryItems),
          items: itemsWithoutSubCategory
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/get-by-grub', async (req, res) => {
  try {
    const grub = req.query.grub; // e.g., ?grub=Veg (optional filter)

    // Fetch all categories
    const categories = await Category.find();

    // Fetch all items and populate their subCategory, filtered by Grub if provided
    let query = {};
    if (grub) {
      query.Grub = grub; // Filter by Grub value if provided
    }
    const items = await Item.find(query).populate('subCategory');

    // Build the response structure
    const result = await Promise.all(
      categories.map(async (category) => {
        // Get all items for this category
        const categoryItems = items.filter(
          (item) => item.category.toString() === category._id.toString()
        );

        // Separate items with and without subcategories
        const itemsWithoutSubCategory = categoryItems
          .filter((item) => !item.subCategory)
          .map((item) => ({
            _id: item._id,
            name: item.name,
            price: item.price,
            isAvailable: item.isAvailable,
            Grub: item.Grub // Include Grub for reference (optional)
          }));

        // Group items by subcategory
        const subCategoryItems = {};
        categoryItems
          .filter((item) => item.subCategory)
          .forEach((item) => {
            const subCatId = item.subCategory._id.toString();
            if (!subCategoryItems[subCatId]) {
              subCategoryItems[subCatId] = {
                _id: item.subCategory._id,
                name: item.subCategory.name,
                items: []
              };
            }
            subCategoryItems[subCatId].items.push({
              _id: item._id,
              name: item.name,
              price: item.price,
              isAvailable: item.isAvailable,
              Grub: item.Grub // Include Grub for reference (optional)
            });
          });

        // Fetch subcategories for this category to ensure we include empty ones
        const subCategories = await SubCategory.find({ category: category._id });
        subCategories.forEach((subCat) => {
          const subCatId = subCat._id.toString();
          if (!subCategoryItems[subCatId]) {
            subCategoryItems[subCatId] = {
              _id: subCat._id,
              name: subCat.name,
              items: []
            };
          }
        });

        return {
          _id: category._id,
          name: category.name,
          subCategories: Object.values(subCategoryItems),
          items: itemsWithoutSubCategory
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

module.exports = router;
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
