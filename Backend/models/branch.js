const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  branch_name: {
    type: String,
    required: true
  },

  branch_type: {
    type: String,
    enum: ['Owned', 'Franchise'],
    required: true
  },

  branch_email: {
    type: String,
    required: true
  },

  branch_phno: {
    type: String,
    required: true
  },

  branch_location: {
    type: String
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin'
  },
}, { timestamps: true });

module.exports = mongoose.model('Branch', branchSchema);
