const express = require("express");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

const router = express.Router();

// Create SubCategory
router.post("/", async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const subCategory = new SubCategory({ name, category: categoryId });
    await subCategory.save();
    await Category.findByIdAndUpdate(categoryId, { $push: { subCategories: subCategory._id } });

    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// router.get("/:id", async (req, res) => {
//   try {
//      console.log(req.params)
//     const { id } = req.params;
//      console.log(id)
//     const data = await SubCategory.find({ category: id });

//     if (data.length > 0) {
//       return res.json({
//         success :true,
//         data : data
//       })
//     }
//     else{
//       return res.json({
//         success :true,
//         data : data,
//         "message":"no subCategories found!!"
//       })
//     }

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// })




// Get SubCategories by Category ID
router.get("/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subCategories = await SubCategory.find({ category: categoryId });

    if (subCategories.length > 0) {
      return res.json({
        success: true,
        data: subCategories
      });
    } else {
      return res.json({
        success: true,
        data: subCategories,
        message: "No subcategories found!"
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
