const express = require('express');
const router = express.Router();
const { 
  createInvoice, 
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  addInvoicePayment,
  generateInvoicePDF
} = require('../controllers/invoiceController');
const authorize = require('../middlewares/authorize')
// const { 
//   validateInvoiceCreation, 
//   validateInvoiceUpdate,
//   validatePayment 
// } = require('../middleware/invoiceValidation');

// Create Invoice
router.post('/create-invoice', 
  authorize.verifyJwtUser, 
  // validateInvoiceCreation, 
  createInvoice
);

// Get All Invoices
router.get('/getall', 

  authorize.verifyJwtUser, 
  getInvoices
);

// Get Single Invoice
router.get('/:id', 
  authorize.verifyJwtUser,  
  getInvoiceById
);

// Generate PDF Invoice
router.get('/:id/pdf', 
  authorize.verifyJwtUser, 
  generateInvoicePDF
);

// Update Invoice
router.put('/:id', 
  authorize.verifyJwtUser, 
  // validateInvoiceUpdate, 
  updateInvoice
);

// Delete Invoice
router.delete('/:id', 
  authorize.verifyJwtUser, 
  deleteInvoice
);

// Add Payment to Invoice
router.post('/:id/payments', 
  authorize.verifyJwtUser, 
  addInvoicePayment
);

module.exports = router;