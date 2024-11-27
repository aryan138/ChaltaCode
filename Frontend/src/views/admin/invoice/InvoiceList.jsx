import React, { useState, useEffect, useRef, Fragment, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  TrashIcon, 
  PlusIcon,  
  SearchIcon,
  UploadIcon 
} from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

// API Client with Axios
const api = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true
});

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusColors = {
    PAID: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    OVERDUE: 'bg-red-100 text-red-800',
    DRAFT: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status] || statusColors.DRAFT}`}>
      {status}
    </span>
  );
};

// CreateInvoiceForm Component
const CreateInvoiceForm = ({ onSuccess }) => {
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [items, setItems] = useState([
    { product: '', quantity: 1, unitPrice: 0, totalPrice: 0 }
  ]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [logo, setLogo] = useState(null);
  const logoInputRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('http://localhost:3000/products/getall');
        if (response.data && response.data.products) {
          setProducts(response.data.products);
        } else {
          toast.error('Unexpected product data format');
        }
      } catch (error) {
        console.error('Error fetching products', error);
        toast.error('Failed to fetch products');
      }
    };
    fetchProducts();
  }, []);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'product') {
      const selectedProduct = products.find(p => p._id === value);
      if (selectedProduct) {
        newItems[index].unitPrice = selectedProduct.price;
        newItems[index].maxQuantity = selectedProduct.stock;
      } else {
        newItems[index].unitPrice = 0;
        newItems[index].maxQuantity = 1;
      }
    }

    if (field === 'quantity') {
      const parsedQuantity = parseInt(value);
      const maxQuantity = newItems[index].maxQuantity || 1;
      newItems[index].quantity = Math.min(
        Math.max(1, parsedQuantity || 1), 
        maxQuantity
      );
    }

    newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
    const newTotalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);

    setItems(newItems);
    setTotalAmount(newTotalAmount);
  };

  const addItem = () => {
    setItems([
      ...items, 
      { product: '', quantity: 1, unitPrice: 0, totalPrice: 0 }
    ]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    const newTotalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(newTotalAmount);
  };

  const validateForm = () => {
    if (!customer.name) {
      toast.error('Customer name is required');
      return false;
    }

    if (items.length === 0) {
      toast.error('Please add at least one item');
      return false;
    }

    const invalidItems = items.some(item => !item.product);
    if (invalidItems) {
      toast.error('Please select a product for all items');
      return false;
    }

    const invalidQuantities = items.some(item => {
      const product = products.find(p => p._id === item.product);
      return !product || item.quantity > product.stock;
    });
    if (invalidQuantities) {
      toast.error('Invalid product quantities or insufficient stock');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const invoiceData = {
        customer: {
          name: customer.name,
          email: customer.email || '',
          phone: customer.phone || '',
          address: customer.address || ''
        },
        items: items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        })),
        subtotal: totalAmount,
        totalAmount: totalAmount,
        status: 'DRAFT'
      };

      await api.post('/invoices/create-invoice', invoiceData);
      toast.success('Invoice created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error creating invoice', error);
      const errorMessage = error.response?.data?.message || 'Failed to create invoice';
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:!bg-black-700">
      <div className="flex justify-between items-center mb-8 ">
        <h2 className="text-3xl font-bold text-gray-800 dark:!text-white">Create Invoice</h2>
        
        <div className="flex items-center">
          <input
            type="file"
            ref={logoInputRef}
            onChange={handleLogoUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => logoInputRef.current.click()}
            className="flex items-center px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-700"
          >
            <UploadIcon className="h-5 w-5 mr-2" />
            Upload Logo
          </button>
          {logo && (
            <img 
              src={logo} 
              alt="Company Logo" 
              className="ml-4 h-16 w-16 object-contain"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:!text-gray-400">
            Customer Name *
          </label>
          <input
            type="text"
            placeholder="Enter customer name"
            value={customer.name}
            onChange={(e) => setCustomer({...customer, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200"
            required
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md dark:!bg-black-800">
        <div className="grid grid-cols-6 gap-4 mb-4 font-semibold text-gray-700 dark:!text-gray-400">
          <div className="col-span-3">Product</div>
          <div>Quantity</div>
          <div>Unit Price</div>
          <div>Total Price</div>
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-6 gap-4 mb-3 items-center">
            <div className="col-span-3">
              <select
                value={item.product}
                onChange={(e) => updateItem(index, 'product', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                required
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.name} (Stock: {product.stock})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                min="1"
                max={products.find(p => p._id === item.product)?.stock || 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                required
              />
            </div>
            <div>
              <input
                type="number"
                value={item.unitPrice}
                readOnly
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <input
                type="number"
                value={item.totalPrice}
                readOnly
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <button 
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-full"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}

        <button 
          type="button"
          onClick={addItem}
          className="flex items-center text-green-800 hover:bg-blue-50 px-4 py-2 rounded-md dark:!text-green-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Item
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800 dark:!text-gray-400">
          Total Amount: &#8377;{totalAmount.toFixed(2)}
        </div>
        <button 
          type="submit"
          className="px-8 py-3 bg-green-800 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Create Invoice
        </button>
      </div>
    </form>
  );
};

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    searchTerm: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const navigate = useNavigate();

  // Memoized fetchInvoices function
  const fetchInvoices = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const response = await api.get("http://localhost:3000/invoices/getall", {
          params: {
            page,
            limit: 10,
            status: appliedFilters.status,
            startDate: appliedFilters.startDate,
            endDate: appliedFilters.endDate,
            searchTerm: appliedFilters.searchTerm,
          },
        });

        const { invoices, totalPages, currentPage } = response.data;
        setInvoices(invoices);
        setFilteredInvoices(invoices);
        setPagination({ currentPage, totalPages });
      } catch (error) {
        console.error("Error fetching invoices", error);
        toast.error("Failed to fetch invoices");
      } finally {
        setLoading(false);
      }
    },
    [appliedFilters] // Dependencies for fetchInvoices
  );

  // Effect to fetch invoices whenever appliedFilters or pagination changes
  useEffect(() => {
    fetchInvoices(pagination.currentPage);
  }, [fetchInvoices, pagination.currentPage]); // Include fetchInvoices and currentPage in dependencies


  const downloadInvoice = async (invoiceId) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/pdf`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `invoice_${invoiceId}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error downloading invoice', error);
      toast.error('Failed to download invoice');
    }
  };

  const deleteInvoice = async (invoiceId) => {
    try {
      await api.delete(`/invoices/${invoiceId}`);
      setInvoices(invoices.filter(inv => inv._id !== invoiceId));
      setFilteredInvoices(filteredInvoices.filter(inv => inv._id !== invoiceId));
      toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice', error);
      toast.error('Failed to delete invoice');
    }
  };

  const handlePageChange = (newPage) => {
    fetchInvoices(newPage);
  };

  const applyFilters = () => {
    setAppliedFilters(filters); // Update appliedFilters, triggering the API call
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:!text-gray-100">Users</h1>
        <div className="flex space-x-4">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center bg-green-800 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden dark:!bg-black-700">
        <table className="min-w-full">
          <thead className="bg-gray-100 font-bold dark:!bg-black-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-green-900 uppercase tracking-wider dark:!text-white">Name</th>
              <th className="px-6 py-3 text-left text-xs text-green-900 uppercase tracking-wider dark:!text-white">Email</th>
              <th className="px-6 py-3 text-left text-xs text-green-900 uppercase tracking-wider dark:!text-white">Designation</th>
              <th className="px-6 py-3 text-left text-xs text-green-900 uppercase tracking-wider dark:!text-white">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs text-green-900 uppercase tracking-wider dark:!text-white">Status</th>
              
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice._id} className="hover:bg-gray-50 transition dark:hover:bg-black-500">

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:!text-white">
                  {invoice.invoiceNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:!text-white">
                  {invoice.customer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:!text-white">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:!text-white">
                &#8377;{invoice.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={invoice.status} />
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No invoices found</p>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          {[...Array(pagination.totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-md ${
                pagination.currentPage === index + 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      <Transition appear show={isCreateModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsCreateModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <CreateInvoiceForm 
                    onSuccess={() => {
                      setIsCreateModalOpen(false);
                      fetchInvoices();
                    }} 
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default InvoiceList;