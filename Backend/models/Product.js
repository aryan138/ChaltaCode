const mongoose = require('mongoose');
const user = require('./user');

const ProductSchema = new mongoose.Schema({
  product_id: { type: String, required: true },
  name: { type: String, required: true,trim:true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:user
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
