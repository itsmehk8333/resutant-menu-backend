const express = require('express');
const router = express.Router();
// const SpecialOffer = require('../models/SpecialOffer');
const mongoose = require('mongoose');
const SpecialOffer = require('../models/SpecailOfferIte.schema');

// CREATE - Add a new special offer
router.post('/add-item', async (req, res) => {
    try {
        const { item, SpecialOfferPrice } = req.body;

        // Validation
        if (!item || !SpecialOfferPrice) {
            return res.status(400).json({ message: 'Item ID and SpecialOfferPrice are required' });
        }
        if (!mongoose.Types.ObjectId.isValid(item)) {
            return res.status(400).json({ message: 'Invalid Item ID' });
        }
        if (typeof SpecialOfferPrice !== 'number' || SpecialOfferPrice < 0) {
            return res.status(400).json({ message: 'SpecialOfferPrice must be a positive number' });
        }
        const specialOffer = new SpecialOffer({
            item,
            SpecialOfferPrice
            // createdAt will be set automatically
        });
        const savedSpecialOffer = await specialOffer.save();
        const populatedSpecialOffer = await SpecialOffer.findById(savedSpecialOffer._id).populate('item');
        res.status(201).json({
            message: 'Special offer created successfully',
            specialOffer: populatedSpecialOffer || savedSpecialOffer
        });
    } catch (error) {
        console.error('Error creating special offer:', error);
        res.status(500).json({ message: 'Server error while creating special offer', error: error.message });
    }
});

// READ - Get all special offers
router.get('/get-item', async (req, res) => {
    try {
        const specialOffers = await SpecialOffer.find().populate('item');
        if (!specialOffers || specialOffers.length === 0) {
            return res.json({ message: 'No special offers found' });
        }
        res.status(200).json({
            message: 'Special offers fetched successfully',
            specialOffers
        });
    } catch (error) {
        console.error('Error fetching special offers:', error);
        res.status(500).json({ message: 'Server error while fetching special offers', error: error.message });
    }
});

// READ - Get a single special offer by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Special Offer ID' });
        }
        const specialOffer = await SpecialOffer.findById(id).populate('item');
        if (!specialOffer) {
            return res.status(404).json({ message: 'Special offer not found' });
        }
        res.status(200).json({
            message: 'Special offer fetched successfully',
            specialOffer
        });
    } catch (error) {
        console.error('Error fetching special offer:', error);
        res.status(500).json({ message: 'Server error while fetching special offer', error: error.message });
    }
});

// UPDATE - Update a special offer by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { item, SpecialOfferPrice } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Special Offer ID' });
        }

        const updateData = {};
        // if (item) {
        //     if (!mongoose.Types.ObjectId.isValid(item)) {
        //         return res.status(400).json({ message: 'Invalid Item ID' });
        //     }
        //     updateData.item = item;
        // }
        if (SpecialOfferPrice !== undefined) {
            if (typeof SpecialOfferPrice !== 'number' || SpecialOfferPrice < 0) {
                return res.status(400).json({ message: 'SpecialOfferPrice must be a positive number' });
            }
            updateData.SpecialOfferPrice = SpecialOfferPrice;
        }

        const updatedSpecialOffer = await SpecialOffer.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('item');

        if (!updatedSpecialOffer) {
            return res.status(404).json({ message: 'Special offer not found' });
        }

        res.status(200).json({
            message: 'Special offer updated successfully',
            specialOffer: updatedSpecialOffer
        });
    } catch (error) {
        console.error('Error updating special offer:', error);
        res.status(500).json({ message: 'Server error while updating special offer', error: error.message });
    }
});

// DELETE - Remove a special offer by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Special Offer ID' });
        }
        const deletedSpecialOffer = await SpecialOffer.findByIdAndDelete(id);

        if (!deletedSpecialOffer) {
            return res.status(404).json({ message: 'Special offer not found' });
        }

        res.status(200).json({
            message: 'Special offer deleted successfully',
            specialOffer: deletedSpecialOffer
        });
    } catch (error) {
        console.error('Error deleting special offer:', error);
        res.status(500).json({ message: 'Server error while deleting special offer', error: error.message });
    }
});
module.exports = router;