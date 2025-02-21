const express = require("express");
const SubCategory = require("../models/SubCategory");
const Item = require("../models/Item");

const router = express.Router();

// Create Item
router.post("/", async (req, res) => {
  try {
    const { name, price, subCategoryId } = req.body;
    const item = new Item({ name, price, subCategory: subCategoryId, isAvailable: true });
    await item.save();

    await SubCategory.findByIdAndUpdate(subCategoryId, { $push: { items: item._id } });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Update an existing item

router.put("/:id", async (req, res) => {
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
}
)

// router.put("/:id" , async(req,res) =>{

// })


router.delete("/:id", async (req, res) => {
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

module.exports = router;
