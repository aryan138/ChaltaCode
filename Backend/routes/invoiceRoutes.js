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
  authorize.verifyJwt, 
  // validateInvoiceCreation, 
  createInvoice
);

// Get All Invoices
router.get('/getall', 

  authorize.verifyJwt, 
  getInvoices
);

// Get Single Invoice
router.get('/:id', 
  authorize.verifyJwt,  
  getInvoiceById
);

// Generate PDF Invoice
router.get('/:id/pdf', 
  authorize.verifyJwt, 
  generateInvoicePDF
);

// Update Invoice
router.put('/:id', 
  authorize.verifyJwt, 
  // validateInvoiceUpdate, 
  updateInvoice
);

// Delete Invoice
router.delete('/:id', 
  authorize.verifyJwt, 
  deleteInvoice
);

// Add Payment to Invoice
router.post('/:id/payments', 
  authorize.verifyJwt, 
  addInvoicePayment
);

module.exports = router;