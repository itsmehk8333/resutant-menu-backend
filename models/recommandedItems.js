const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
    createdAt: {type:Date , default:Date.now()},
    isActive:{
        type:Boolean,
        default:true
    }
})

const Recommended = mongoose.model("Recommended", schema);
module.exports = Recommended;