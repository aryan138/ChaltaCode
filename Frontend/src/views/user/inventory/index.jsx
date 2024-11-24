import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "./components/Table";
import Upload from "./components/Upload";
import Storage from "./components/Storage";

const App = () => {
  const [products, setProducts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [errors, setErrors] = useState({}); // State to track errors

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products/getall");
        console.log("Fetched products:", response.data.products);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Validate the form inputs
  const validateForm = () => {
    const newErrors = {};

    // Regex for validation
    const nameRegex = /^[a-zA-Z0-9_\s]+$/;
    const priceRegex = /^(?!0$)\d+(\.\d+)?$/;
    const stockRegex = /^[0-9]+$/;

    if (!editingProduct.name || !nameRegex.test(editingProduct.name)) {
      newErrors.name = "Name must contain only letters and spaces.";
    }
    if (!editingProduct.price || !priceRegex.test(editingProduct.price)) {
      newErrors.price = "Price must be a valid number (up to 2 decimal places).";
    }
    if (!editingProduct.stock || !stockRegex.test(editingProduct.stock)) {
      newErrors.stock = "Stock must be a valid positive number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save the edited product
  const handleSave = async () => {
    if (!validateForm()) {
      return; // Do not proceed if the form is invalid
    }

    try {
      await axios.put(
        `http://localhost:3000/products/update/${editingProduct.product_id}`,
        editingProduct
      );
      setProducts((prevData) =>
        prevData.map((product) =>
          product.product_id === editingProduct.product_id
            ? editingProduct
            : product
        )
      );
      setEditModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Delete a product
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/products/delete/${productId}`);
      setProducts((prevData) =>
        prevData.filter((product) => product.product_id !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Edit a product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2">
        <Storage />
        <Upload />
      </div>
      <div className="mt-5 h-full w-full pb-4">
        <Table data={products} onDelete={handleDelete} onEdit={handleEdit} />
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium">Product ID</label>
                <input
                  type="text"
                  name="product_id"
                  value={editingProduct.product_id}
                  disabled
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleChange}
                  className={`mt-1 p-2 w-full border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-lg`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editingProduct.price}
                  onChange={handleChange}
                  className={`mt-1 p-2 w-full border ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  } rounded-lg`}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={editingProduct.stock}
                  onChange={handleChange}
                  className={`mt-1 p-2 w-full border ${
                    errors.stock ? "border-red-500" : "border-gray-300"
                  } rounded-lg`}
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                )}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
