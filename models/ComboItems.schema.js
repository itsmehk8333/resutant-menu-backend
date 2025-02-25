// models/Combo.js
const mongoose = require('mongoose');

const comboSchema = new mongoose.Schema({
    items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'  // Must match the model name exactly
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Combo = mongoose.model('Combo', comboSchema);
module.exports = Combo;