const mongoose = require('mongoose');
const { NumberInstance } = require('twilio/lib/rest/pricing/v2/voice/number');

const invoiceSchema = new mongoose.Schema({
    invoice_id: { type: String, required: true, unique: true },
    invoice_number: { type: String, required: true },
    invoice_created_at: { type: Date },
    invoice_total_amount: { type: Number },
    invoice_branch_id: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('invoice', invoiceSchema)