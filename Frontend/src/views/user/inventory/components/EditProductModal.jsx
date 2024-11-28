import React from "react";

const EditProductModal = ({
  editModalOpen,
  setEditModalOpen,
  editingProduct,
  handleChange,
  errors,
  handleSave,
  handleCloseModal,
}) => {
  return (
    editModalOpen && (
      <div
        className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-75 backdrop-blur-sm"
        onClick={handleCloseModal}
      >
        <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg relative dark:bg-black-800 ">
          {/* Close Icon */}
          <button
            onClick={() => setEditModalOpen(false)}
            className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">Edit Product</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Product ID</label>
              <input
                type="text"
                name="product_id"
                value={editingProduct.product_id}
                disabled
                className="mt-1 w-full rounded-lg border p-2 text-gray-700 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Name</label>
              <input
                type="text"
                name="name"
                value={editingProduct.name}
                onChange={handleChange}
                className={`mt-1 w-full rounded-lg text-gray-800 border p-2 focus:outline-none focus:ring-2 focus:ring-brand-400 dark:bg-gray-600 dark:text-gray-300 ${
                  errors.name ? "border-red-500 focus:ring-red-400" : "border-gray-300 dark:border-gray-500"
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Price</label>
              <input
                type="number"
                name="price"
                value={editingProduct.price}
                onChange={handleChange}
                className={`mt-1 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-brand-400 dark:bg-gray-600 dark:text-gray-300 ${
                  errors.price ? "border-red-500 focus:ring-red-400" : "border-gray-300 dark:border-gray-500"
                }`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Stock</label>
              <input
                type="number"
                name="stock"
                value={editingProduct.stock}
                onChange={handleChange}
                className={`mt-1 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-brand-400 dark:bg-gray-600 dark:text-gray-300 ${
                  errors.stock ? "border-red-500 focus:ring-red-400" : "border-gray-300 dark:border-gray-500"
                }`}
              />
              {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-bold text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-400 dark:bg-brand-600 dark:hover:bg-brand-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditProductModal;
