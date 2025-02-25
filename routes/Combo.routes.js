const express = require('express');
const Combo = require('../models/ComboItems.schema');
const router = express.Router();
// const Combo = require('./models/Combo'); // Adjust path to your model file

// GET all combos
router.get('/', async (req, res) => {
    try {
        const combos = await Combo.find().populate('items.item');
        res.json(combos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching combos', error: error.message });
    }
});

// GET a single combo by ID
router.get('/:id', async (req, res) => {
    try {
        const combo = await Combo.findById(req.params.id).populate('items.item');
        if (!combo) {
            return res.status(404).json({ message: 'Combo not found' });
        }
        res.json(combo);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching combo', error: error.message });
    }
});

// POST a new combo
router.post('/', async (req, res) => {
    try {
        const { items } = req.body;

        // Validate that items array is provided and not empty
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Items array is required' });
        }

        const newCombo = new Combo({
            items: items.map(itemId => ({ item: itemId })),
        });

        const savedCombo = await newCombo.save();
        const populatedCombo = await savedCombo.populate('items.item');
        res.status(201).json(populatedCombo);
    } catch (error) {
        res.status(400).json({ message: 'Error creating combo', error: error.message });
    }
});

// PUT (update) a combo
router.put('/:id', async (req, res) => {
    try {
        const { items } = req.body;

        const updateData = {};
        if (items) {
            updateData.items = items.map(itemId => ({ item: itemId }));
        }

        const combo = await Combo.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('items.item');

        if (!combo) {
            return res.status(404).json({ message: 'Combo not found' });
        }

        res.json(combo);
    } catch (error) {
        res.status(400).json({ message: 'Error updating combo', error: error.message });
    }
});

// DELETE a combo
router.delete('/:id', async (req, res) => {
    try {
        const combo = await Combo.findByIdAndDelete(req.params.id);
        if (!combo) {
            return res.status(404).json({ message: 'Combo not found' });
        }
        res.json({ message: 'Combo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting combo', error: error.message });
    }
});

module.exports = router;