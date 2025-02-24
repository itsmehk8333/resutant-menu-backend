const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item", // Assuming this references an Item model
        required: true
    },
    SpecialOfferPrice: { // Corrected typo from Specail to Special
        type: Number, // Corrected Type to type
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Corrected Date.now() to Date.now
    }
});

const SpecialOffer = mongoose.model("SpecialOfferItems", schema); // Corrected Model to model and typo in Specail

module.exports = SpecialOffer;