const Invoice = require('../models/Invoice');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const moment = require('moment');

// Generate Unique Invoice Number
const generateInvoiceNumber = async () => {
  const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
  const currentYear = new Date().getFullYear();
  const prefix = `INV-${currentYear}`;
  
  if (!lastInvoice) {
    return `${prefix}-0001`;
  }
  
  const lastInvoiceNumber = lastInvoice.invoiceNumber;
  const lastSequence = parseInt(lastInvoiceNumber.split('-').pop());
  const newSequence = lastSequence + 1;
  
  return `${prefix}-${newSequence.toString().padStart(4, '0')}`;
};

// Create Invoice
// const createInvoice = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { customer, items, subtotal, totalAmount, status = 'DRAFT' } = req.body;

//     // Validate input
//     if (!customer || !customer.name) {
//       throw new Error('Customer name is required');
//     }

//     if (!items || items.length === 0) {
//       throw new Error('At least one item is required');
//     }

//     // Process items and validate stock
//     const processedItems = await Promise.all(items.map(async (item) => {
//       const product = await Product.findById(item.product);
      
//       if (!product) {
//         throw new Error(`Product not found: ${item.product}`);
//       }

//       if (product.stock < item.quantity) {
//         throw new Error(`Insufficient stock for product: ${product.name}`);
//       }

//       // Reduce product stock
//       product.stock -= item.quantity;
//       await product.save({ session });

//       return {
//         product: product._id,
//         name: product.name,
//         quantity: item.quantity,
//         unitPrice: item.unitPrice || product.price,
//         totalPrice: item.totalPrice || (item.quantity * (item.unitPrice || product.price))
//       };
//     }));

//     // Calculate totals
//     const calculatedSubtotal = processedItems.reduce((sum, item) => sum + item.totalPrice, 0);

//     // Generate Invoice Number
//     const invoiceNumber = await generateInvoiceNumber();

//     // Create Invoice
//     const newInvoice = new Invoice({
//       invoiceNumber,
//       customer: {
//         name: customer.name,
//         email: customer.email || '',
//         phone: customer.phone || '',
//         address: customer.address || ''
//       },
//       items: processedItems,
//       subtotal: subtotal || calculatedSubtotal,
//       totalAmount: totalAmount || calculatedSubtotal,
//       status,
//       shop: req.user.shop,
//       createdBy: req.user._id
//     });

//     await newInvoice.save({ session });
//     await session.commitTransaction();

//     res.status(201).json({
//       message: 'Invoice created successfully',
//       invoice: newInvoice
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     res.status(400).json({ 
//       message: 'Invoice creation failed', 
//       error: error.message 
//     });
//   } finally {
//     session.endSession();
//   }
// };

const createInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customer, items, subtotal, totalAmount, status = 'PAID' } = req.body;

    // Validate input
    if (!customer || !customer.name) {
      return res.status(404).json({success:false,message:'customer not found'});
    }

    if (!items || items.length === 0) {
      return res.status(404).json({success:false,message:'items not found in invoice'});
    }

    // Process items and validate stock
    const processedItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({success:false,message:'product not found'});
      }

      if (product.stock < item.quantity) {
        return res.status(401).json({success:false,message:`Insufficient stock for product: ${product.name}`});
      }

      // Reduce product stock
      product.stock -= item.quantity;
      await product.save({ session });

      return {
        product: product._id,
        productId: product._id.toString(), // Add string representation of product ID
        name: product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice || product.price,
        totalPrice: item.totalPrice || (item.quantity * (item.unitPrice || product.price))
      };
    }));

    // Calculate totals
    const calculatedSubtotal = processedItems.reduce((sum, item) => sum + item.totalPrice, 0);

    // Generate Invoice Number
    const invoiceNumber = await generateInvoiceNumber();

    // Create Invoice
    const newInvoice = new Invoice({
      invoiceNumber,
      customer: {
        _id: customer._id ? mongoose.Types.ObjectId(customer._id) : undefined,
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone || ''
      },
      items: processedItems,
      subtotal: subtotal || calculatedSubtotal,
      totalAmount: totalAmount || calculatedSubtotal,
      status,
      shop: req.user.shop,
      createdBy: req.user._id,
      paymentStatus: status === 'PAID' ? 'PAID' : 'UNPAID'
    });

    await newInvoice.save({ session });
    await session.commitTransaction();

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice: newInvoice
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Invoice Creation Error:', error);
    res.status(400).json({ 
      message: 'Invoice creation failed', 
      error: error.message 
    });
  } finally {
    session.endSession();
  }
};


const getInvoices = async (req, res) => {
  try {
    const user_id = req.user._id; // Extract the user ID from the request
    const { page = 1, limit = 10, startDate, endDate, searchTerm } = req.query;

    // Build the query filters dynamically
    const query = {
      createdBy: user_id,
      status:"PAID"
    };

    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }
    if (searchTerm) {
      query.$or = [
        { invoiceNumber: { $regex: searchTerm, $options: "i" } },
        { 'customer.name': { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    const invoices = await Invoice.find(query).skip(skip).limit(Number(limit)).sort({updatedAt:-1});
    const totalInvoices = await Invoice.countDocuments(query);
    const totalPages = Math.ceil(totalInvoices / limit);

    // Return the response
    return res.status(200).json({
      success: true,
      message: "Invoices fetched successfully",
      invoices,
      currentPage: Number(page),
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch invoices",
      error: error.message,
    });
  }
};



// Get Single Invoice
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('items.product')
      .populate('createdBy', 'name email');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching invoice', 
      error: error.message 
    });
  }
};

// Update Invoice
const updateInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find existing invoice
    const existingInvoice = await Invoice.findById(id);
    if (!existingInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Validate status updates
    if (updateData.status) {
      const validStatuses = ['DRAFT', 'SENT', 'PAID', 'CANCELLED'];
      if (!validStatuses.includes(updateData.status)) {
        throw new Error('Invalid invoice status');
      }
    }

    // Handle item updates with stock management
    if (updateData.items) {
      // Restore original stock
      for (let item of existingInvoice.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save({ session });
        }
      }

      // Process new items and validate stock
      const processedItems = await Promise.all(updateData.items.map(async (item) => {
        const product = await Product.findById(item.product);
        
        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        // Reduce product stock
        product.stock -= item.quantity;
        await product.save({ session });

        return {
          product: product._id,
          name: product.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice
        };
      }));

      updateData.items = processedItems;
    }

    // Update invoice
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id, 
      updateData, 
      { 
        new: true, 
        runValidators: true 
      }
    );

    await session.commitTransaction();

    res.json({
      message: 'Invoice updated successfully',
      invoice: updatedInvoice
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ 
      message: 'Error updating invoice', 
      error: error.message 
    });
  } finally {
    session.endSession();
  }
};

// Delete Invoice
const deleteInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Restore stock for deleted invoice
    for (let item of invoice.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save({ session });
      }
    }

    // Delete invoice
    await Invoice.findByIdAndDelete(req.params.id, { session });

    await session.commitTransaction();
    
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ 
      message: 'Error deleting invoice', 
      error: error.message 
    });
  } finally {
    session.endSession();
  }
};

// Add Payment
const addInvoicePayment = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    const { amount, paymentMethod, notes } = req.body;

    // Validate payment amount
    if (amount <= 0) {
      return res.status(400).json({ message: 'Payment amount must be positive' });
    }

    if (amount > invoice.totalAmount - (invoice.paymentHistory?.reduce((sum, payment) => sum + payment.amount, 0) || 0)) {
      return res.status(400).json({ message: 'Payment amount exceeds remaining balance' });
    }
    
    invoice.addPayment(amount, paymentMethod, notes);
    await invoice.save();
    
    res.json({
      message: 'Payment added successfully',
      invoice
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error adding payment', 
      error: error.message 
    });
  }
};

// Generate PDF Invoice
// const generateInvoicePDF = async (req, res) => {
//   try {
//     console.log("enter the invoice download")
//     const invoice = await Invoice.findById(req.params.id) // Match `invoiceId` from frontend
//       .populate('items')

//     if (!invoice) {
//       return res.status(409).json({ message: 'Invoice not found' });
//     }
//     console.log(invoice);
//     const doc = new PDFDocument();
//     const filename = `invoice_${invoice.invoiceNumber}.pdf`;

//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

//     doc.pipe(res);

//     // PDF Content
//     doc.fontSize(20).text('INVOICE', { align: 'center' });
//     doc.moveDown();

//     // Invoice Details
//     doc.fontSize(10)
//        .text(`Invoice Number: ${invoice.invoiceNumber}`)
//        .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`)
//        .text(`Status: ${invoice.status}`);

//     // Customer Details
//     doc.moveDown();
//     doc.fontSize(12).text('Customer Details', { underline: true });
//     doc.fontSize(10)
//        .text(`Name: ${invoice.customer?.name || 'N/A'}`)
//        .text(`Email: ${invoice.customer?.email || 'N/A'}`)
//        .text(`Phone: ${invoice.customer?.phone || 'N/A'}`)
//        .text(`Address: ${invoice.customer?.address || 'N/A'}`);

//     // Items Table
//     doc.moveDown();
//     doc.fontSize(12).text('Invoice Items', { underline: true });

//     // Table Header
//     doc.fontSize(10)
//        .text('Product', 100, doc.y, { width: 200, align: 'left' })
//        .text('Quantity', 300, doc.y, { width: 100, align: 'right' })
//        .text('Unit Price', 400, doc.y, { width: 100, align: 'right' })
//        .text('Total', 500, doc.y, { width: 100, align: 'right' });

//     doc.moveDown();

//     // Items Rows
//     invoice.items.forEach(item => {
//       doc.text(item.product?.name || 'N/A', 100, doc.y, { width: 200, align: 'left' })
//          .text(item.quantity.toString(), 300, doc.y, { width: 100, align: 'right' })
//          .text(`$${(item.product?.unitPrice || 0).toFixed(2)}`, 400, doc.y, { width: 100, align: 'right' })
//          .text(`$${(item.quantity * item.product?.unitPrice || 0).toFixed(2)}`, 500, doc.y, { width: 100, align: 'right' });
//       doc.moveDown();
//     });

//     // Totals
//     doc.moveDown();
//     doc.fontSize(12)
//        .text(`Subtotal: $${invoice.subtotal?.toFixed(2) || '0.00'}`, { align: 'right' })
//        .text(`Total Amount: $${invoice.totalAmount?.toFixed(2) || '0.00'}`, { align: 'right' });

//     doc.end(); // Ensure PDF is finalized
//   } catch (error) {
//     console.error('Error generating PDF:', error.message);
//     res.status(500).json({ 
//       message: 'Error generating PDF', 
//       error: error.message 
//     });
//   }
// };
const generateInvoicePDF = async (req, res) => {
  try {
    console.log("Entering the invoice download process...");

    // Fetch the invoice by ID with populated items
    const invoice = await Invoice.findById(req.params.id).populate('items');
    if (!invoice) {
      return res.status(409).json({ message: 'Invoice not found' });
    }

    console.log("Invoice fetched successfully:", invoice);

    // Initialize PDF document
    const doc = new PDFDocument();
    const filename = `invoice_${invoice.invoiceNumber}.pdf`;

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Pipe the PDF stream to the response
    doc.pipe(res);

    // Generate PDF Content
    createPDFContent(doc, invoice);

    // Finalize the document
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error.message);
    res.status(500).json({ 
      message: 'Error generating PDF', 
      error: error.message 
    });
  }
};

// Helper function to structure PDF content

const createPDFContent = (doc, invoice) => {
  // Title Section
  doc.fontSize(24).fillColor('#0B1437').text('INVOICE', { align: 'center', underline: true });
  doc.moveDown(2);

  // Invoice Details Section
  addSectionHeader(doc, 'Invoice Details', '#1D3557');
  doc.fontSize(10).fillColor('#000');
  doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
  doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
  doc.text(`Status: ${invoice.status}`);
  doc.moveDown(1);

  // Customer Details Section
  addSectionHeader(doc, 'Customer Details', '#1D3557');
  doc.fontSize(10).fillColor('#000');
  doc.text(`Name: ${invoice.customer?.name || 'N/A'}`);
  doc.text(`Email: ${invoice.customer?.email || 'N/A'}`);
  doc.text(`Phone: ${invoice.customer?.phone || 'N/A'}`);
  doc.text(`Address: ${invoice.customer?.address || 'N/A'}`);
  doc.moveDown(1);

  // Invoice Items Section
  addSectionHeader(doc, 'Invoice Items', '#1D3557');
  addTableHeader(doc);
  addTableRows(doc, invoice.items);

  // Totals Section
  addInvoiceTotals(doc, invoice);
};

// Helper function for section headers
const addSectionHeader = (doc, title, color) => {
  doc.fontSize(14).fillColor(color).text(title, { underline: true, align: 'left' });
  doc.moveDown(0.5);
};

// Enhanced table header with a background
const addTableHeader = (doc) => {
  const headerOptions = { width: 100, align: 'center' };

  doc.rect(100, doc.y - 5, 500, 20).fill('#F1F1F1'); // Background rectangle
  doc.fillColor('#000').fontSize(10)
    .text('Product', 100, doc.y, { width: 200, align: 'left' })
    .text('Quantity', 300, doc.y, headerOptions)
    .text('Unit Price', 400, doc.y, headerOptions)
    .text('Total', 500, doc.y, headerOptions);
  doc.moveDown();
  doc.moveTo(100, doc.y).lineTo(600, doc.y).stroke(); 
  doc.moveDown();
};

// Enhanced table rows with alternating row colors
const addTableRows = (doc, items) => {
  const rowOptions = { width: 100, align: 'center' };
  const backgroundColors = ['#FFFFFF', '#F9FAFB'];

  items.forEach((item, index) => {
    const yPosition = doc.y;
    doc.rect(100, yPosition - 2, 500, 20).fill(backgroundColors[index % 2]); 

    doc.fillColor('#000').fontSize(10)
      .text(item.name || 'N/A', 100, yPosition, { width: 200, align: 'left' })
      .text(item.quantity.toString(), 300, yPosition, rowOptions)
      .text(`Rs${(item.unitPrice || 0).toFixed(2)}`, 400, yPosition, rowOptions)
      .text(`Rs${(item.quantity * item.unitPrice || 0).toFixed(2)}`, 500, yPosition, rowOptions);
    doc.moveDown(1.5);
  });

  doc.moveTo(100, doc.y).lineTo(600, doc.y).stroke(); // Line after last row
};

// Enhanced totals section
const addInvoiceTotals = (doc, invoice) => {
  doc.moveDown(2);
  doc.fontSize(12).fillColor('#000');
  
  const totalY = doc.y;
  
  doc.text('Subtotal:', 400, totalY, { width: 100, align: 'right' })
     .text(`Rs${invoice.subtotal?.toFixed(2) || '0.00'}`, 500, totalY, { align: 'right' });
  
  doc.moveDown();
  doc.text('Total Amount:', 400, doc.y, { width: 100, align: 'right' })
     .fontSize(14).fillColor('#1D3557').text(`Rs${invoice.totalAmount?.toFixed(2) || '0.00'}`, 500, doc.y, { align: 'right' });
};


const getTotalEarnings = async (req, res) => {
  try {
    const userId = req.user._id; // Get userId from request parameters

    const result = await Invoice.aggregate([
      {
        $match: {
          status: 'PAID',       
          createdBy: userId        
        }
      },
      {
        $group: {
          _id: null,            
          totalEarnings: { $sum: '$totalAmount' } 
        }
      }
    ]);

    const totalEarnings = result[0]?.totalEarnings || 0;

    // Respond with success
    res.status(200).json({
      success: true,
      earnings: totalEarnings
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: 'Failed to calculate total earnings',
      error: error.message
    });
  }
};








module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  addInvoicePayment,
  generateInvoicePDF,
  getTotalEarnings,
};