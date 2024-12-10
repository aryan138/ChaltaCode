import React, { useState, useRef } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { DownloadIcon, PrinterIcon } from '@heroicons/react/outline';

const InvoiceDownloadModal = ({ 
  isOpen, 
  onClose, 
  invoiceData, 
  logo 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef();

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Embed logo if available
      if (logo) {
        const logoImage = await pdfDoc.embedPng(logo);
        page.drawImage(logoImage, {
          x: 50,
          y: height - 100,
          width: 100,
          height: 100
        });
      }

      // Invoice Header
      page.drawText('INVOICE', {
        x: width - 200,
        y: height - 50,
        size: 24,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      // Customer Details
      page.drawText(`Customer Details:`, {
        x: 50,
        y: height - 200,
        size: 14,
        font: boldFont
      });
      page.drawText(`Name: ${invoiceData.customer.name}`, {
        x: 50,
        y: height - 220,
        size: 12,
        font
      });
      page.drawText(`Email: ${invoiceData.customer.email}`, {
        x: 50,
        y: height - 240,
        size: 12,
        font
      });
      page.drawText(`Phone: ${invoiceData.customer.phone}`, {
        x: 50,
        y: height - 260,
        size: 12,
        font
      });

      // Invoice Items
      page.drawText('Invoice Items:', {
        x: 50,
        y: height - 300,
        size: 14,
        font: boldFont
      });

      let yOffset = height - 320;
      invoiceData.items.forEach((item, index) => {
        page.drawText(`${index + 1}. ${item.product} - Qty: ${item.quantity}`, {
          x: 50,
          y: yOffset,
          size: 12,
          font
        });
        page.drawText(`Unit Price: ₹${item.unitPrice.toFixed(2)}`, {
          x: 300,
          y: yOffset,
          size: 12,
          font
        });
        page.drawText(`Total: ₹${item.totalPrice.toFixed(2)}`, {
          x: 450,
          y: yOffset,
          size: 12,
          font
        });
        yOffset -= 20;
      });

      // Total Amount
      page.drawText(`Total Amount: ₹${invoiceData.totalAmount.toFixed(2)}`, {
        x: width - 250,
        y: yOffset - 50,
        size: 16,
        font: boldFont,
        color: rgb(0, 0.5, 0)
      });

      // Serialize PDF to bytes
      const pdfBytes = await pdfDoc.save();

      // Create and trigger download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `invoice_${invoiceData.customer.name}_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();

      toast.success('Invoice downloaded successfully!');
      onClose();
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast.error('Failed to generate invoice PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative z-50 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
            Invoice Generated Successfully
          </Dialog.Title>
          
          <div className="mt-4 flex space-x-4">
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className="flex items-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              <DownloadIcon className="mr-2 h-5 w-5" />
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <PrinterIcon className="mr-2 h-5 w-5" />
              Print Invoice
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default InvoiceDownloadModal;