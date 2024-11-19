import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  EyeIcon, 
  DownloadIcon, 
  TrashIcon, 
  PlusIcon, 
  FilterIcon, 
  SearchIcon 
} from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

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

// API Client with Axios
const api = axios.create({
  baseURL: 'http://localhost:3000/', // Updated base URL
  withCredentials: true // Important for sending cookies
});

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    searchTerm: ''
  });

  const navigate = useNavigate();

  // Fetch Invoices
  const fetchInvoices = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get('http://localhost:3000/invoices/getall', {
        params: {
          page,
          limit: 10,
          status: filters.status,
          startDate: filters.startDate,
          endDate: filters.endDate,
          searchTerm: filters.searchTerm
        }
      });

      const { invoices, totalPages, currentPage } = response.data;
      setInvoices(invoices);
      setFilteredInvoices(invoices);
      setPagination({ currentPage, totalPages });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoices', error);
      toast.error('Failed to fetch invoices');
      setLoading(false);
    }
  };

  // Initial and Filtered Fetch
  useEffect(() => {
    fetchInvoices();
  }, [filters]);

  // Download Invoice
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

  // Delete Invoice
  const deleteInvoice = async (invoiceId) => {
    try {
      await api.delete(`/invoices/${invoiceId}`);
      
      // Remove from local state
      setInvoices(invoices.filter(inv => inv._id !== invoiceId));
      setFilteredInvoices(filteredInvoices.filter(inv => inv._id !== invoiceId));
      
      toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice', error);
      toast.error('Failed to delete invoice');
    }
  };

  // Pagination Handler
  const handlePageChange = (newPage) => {
    fetchInvoices(newPage);
  };

  // Render Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
        <div className="flex space-x-4">
          <button 
            onClick={() => navigate('/admin/invoice/create-invoice')}
            className="flex items-center bg-[#4318ff] text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search Input */}
          <div className="relative">
            <input 
              type="text"
              placeholder="Search invoices..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({...prev, searchTerm: e.target.value}))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
            <option value="DRAFT">Draft</option>
          </select>

          {/* Date Range Filters */}
          <div className="flex space-x-2">
            <input 
              type="date"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({...prev, startDate: e.target.value}))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="date"
              placeholder="End Date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({...prev, endDate: e.target.value}))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 font-bold">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider">Invoice #</th>
              <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs text-gray-900 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {invoice.invoiceNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {invoice.customer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${invoice.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={invoice.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => navigate(`/invoice/${invoice._id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => downloadInvoice(invoice._id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <DownloadIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => deleteInvoice(invoice._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredInvoices.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No invoices found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
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
    </div>
  );
};

export default InvoiceList;