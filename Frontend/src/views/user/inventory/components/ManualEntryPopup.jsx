import React, { useState } from 'react';

const ManualEntryPopup = ({ handleFormSubmit, loading, error, handleClosePopup }) => {
  const [formData, setFormData] = useState({
    product_id: '',
    name: '',
    price: '',
    stock: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    product_id: '',
    name: '',
    price: '',
    stock: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateFields = () => {
    const errors = {};
    if (!formData.product_id) errors.product_id = 'Product ID is required';
    if (!formData.name) errors.name = 'Product Name is required';
    if (!formData.price || formData.price <= 0) errors.price = 'Price must be a positive number';
    if (!formData.stock || formData.stock < 0) errors.stock = 'Stock cannot be negative';
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0; // returns true if there are no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      handleFormSubmit(e); // Submit the form if fields are valid
    } else {
      console.log('Form has errors');
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Manual Entry</h4>
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="product_id" className="block text-sm">Product ID</label>
          <input
            type="text"
            name="product_id"
            id="product_id"
            value={formData.product_id}
            onChange={handleChange}
            required
            className={`w-full rounded-lg border px-4 py-2 ${fieldErrors.product_id ? 'border-red-500' : ''}`}
          />
          {fieldErrors.product_id && <p className="text-red-500 text-xs">{fieldErrors.product_id}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="block text-sm">Product Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full rounded-lg border px-4 py-2 ${fieldErrors.name ? 'border-red-500' : ''}`}
          />
          {fieldErrors.name && <p className="text-red-500 text-xs">{fieldErrors.name}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="block text-sm">Price</label>
          <input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            required
            className={`w-full rounded-lg border px-4 py-2 ${fieldErrors.price ? 'border-red-500' : ''}`}
          />
          {fieldErrors.price && <p className="text-red-500 text-xs">{fieldErrors.price}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="stock" className="block text-sm">Stock</label>
          <input
            type="number"
            name="stock"
            id="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className={`w-full rounded-lg border px-4 py-2 ${fieldErrors.stock ? 'border-red-500' : ''}`}
          />
          {fieldErrors.stock && <p className="text-red-500 text-xs">{fieldErrors.stock}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-500 py-2 text-white hover:bg-brand-600 disabled:bg-gray-400"
        >
          {loading ? "Submitting..." : "Submit Data"}
        </button>
      </form>
    </div>
  );
};

export default ManualEntryPopup;
