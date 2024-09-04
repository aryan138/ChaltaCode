const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'branch' },
    order_id: { type: String, unique: true },
    product_name: { type: String, required: true },
    product_quantity: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected'], 
        default: 'pending' 
    },
    acceptToken: { type: String },
    rejectToken: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('order',orderSchema);