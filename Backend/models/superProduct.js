const mongoose = require('mongoose');

const SuperProductSchema = new mongoose.Schema({
  product_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('SuperProduct', SuperProductSchema);
