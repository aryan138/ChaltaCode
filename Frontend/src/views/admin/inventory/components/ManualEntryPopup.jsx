import React from 'react';

const ManualEntryPopup = ({ handleFormSubmit, loading, error, handleClosePopup }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Manual Entry</h4>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label htmlFor="product_id" className="block text-sm">Product ID</label>
          <input
            type="text"
            name="product_id"
            id="product_id"
            required
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="block text-sm">Product Name</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="block text-sm">Price</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="stock" className="block text-sm">Stock</label>
          <input
            type="number"
            name="stock"
            id="stock"
            required
            className="w-full rounded-lg border px-4 py-2"
          />
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
