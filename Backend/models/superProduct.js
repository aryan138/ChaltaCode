const mongoose = require('mongoose');
const admin = require('./admin');

const SuperProductSchema = new mongoose.Schema({
  product_id: { type: String, required: true},
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  admin:{
    type:mongoose.Schema.Types.ObjectId,
    ref:admin
  }
}, { timestamps: true });

module.exports = mongoose.model('SuperProduct', SuperProductSchema);
