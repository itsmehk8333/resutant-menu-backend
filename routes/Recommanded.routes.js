const express = require('express');
const router = express.Router();
const Recommended = require('../models/recommandedItems');
const mongoose = require('mongoose');

// POST route to add items to Recommended
router.post('/', async (req, res) => {
    try {
        // Extract items from the request body
        let { items } = req.body;

        // Normalize input: Convert single item to array if necessary
        if (!items) {
            return res.status(400).json({ message: 'Items must be provided' });
        }

        // If items is not an array (i.e., single item), convert it to an array
        if (!Array.isArray(items)) {
            items = [items]; // Wrap single item in an array
        }

        // Validate that each item is a valid ObjectId
        const invalidIds = items.filter(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({ message: `Invalid Item IDs: ${invalidIds.join(', ')}` });
        }

        // Check if a Recommended document already exists
        let recommended = await Recommended.findOne();

        if (recommended) {
            // If exists, append new items (avoid duplicates)
            const existingItems = recommended.items.map(id => id.toString());
            const newItems = items.filter(itemId => !existingItems.includes(itemId));
            recommended.items.push(...newItems);
            await recommended.save();
        } else {
            // If no document exists, create a new one
            recommended = new Recommended({
                items: items,
                // createdAt will be set automatically by default
            });
            await recommended.save();
        }

        // Populate items for response (optional)
        const populatedRecommended = await Recommended.findById(recommended._id).populate('items');

        // Send response
        res.status(201).json({
            message: 'Items added to Recommended successfully',
            recommended: populatedRecommended || recommended
        });
    } catch (error) {
        console.error('Error adding items to Recommended:', error);
        res.status(500).json({ message: 'Server error while adding items', error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {

        const data = await Recommended.find().populate({
            path: "items"
        })

        res.json({
            status: true,
            data: data
        });

    } catch (error) {

        console.log(error , "error")
    }
})



module.exports = router;