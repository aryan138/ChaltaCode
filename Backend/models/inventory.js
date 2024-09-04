const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    item_id: {
        type: String,
        required: true,
        unique: true
    },
    item_name: {
        type: String,
        required: true
    },
    item_quantity: {
        type: Number,
        required: true
    },
    inventoryBranch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InventoryBranch',
        required: true
    },
    
}, { timestamps: true });

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;
