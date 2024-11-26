import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "./components/Table";
import Upload from "./components/Upload";
import Storage from "./components/Storage";
import { Search } from "lucide-react";

const App = () => {
  const [products, setProducts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [errors, setErrors] = useState({}); // State to track errors
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/superproducts/getall"
        );
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.product_id.toString().includes(searchQuery) ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Validate the form inputs
  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z0-9_\s]+$/;
    const priceRegex = /^(?!0$)\d+(\.\d+)?$/;
    const stockRegex = /^[0-9]+$/;

    if (!editingProduct.name || !nameRegex.test(editingProduct.name)) {
      newErrors.name = "Name must contain only letters and spaces.";
    }
    if (!editingProduct.price || !priceRegex.test(editingProduct.price)) {
      newErrors.price =
        "Price must be a valid number (up to 2 decimal places).";
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
        `http://localhost:3000/superproducts/update/${editingProduct.product_id}`,
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
      await axios.delete(`http://localhost:3000/superproducts/delete/${productId}`);
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

  // Function to update data in the parent component
  const handleDataUpdate = (newData) => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2">
        <Storage />
        <Upload onDataUpdate={handleDataUpdate} />
      </div>

      {/* Search Input */}
      <div className="my-4 flex items-center rounded-lg border border-gray-300 bg-white hover:border-brand-500 hover:ring-2 hover:ring-brand-500 focus-within:ring-2 focus-within:ring-brand-500">
      <span className="pl-3 text-gray-400">
        <Search size={20} /> {/* Lucide Search Icon */}
      </span>
      <input
        type="text"
        placeholder="Search by ID or Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mt-1 w-full rounded-lg border-none bg-white p-2 pl-10 outline-none"
      />
    </div>

      <div className="mt-5 h-full w-full pb-4">
        {/* Pass filtered products to Table */}
        <Table
          data={filteredProducts}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {editModalOpen && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="w-1/3 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Edit Product</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium">Product ID</label>
                <input
                  type="text"
                  name="product_id"
                  value={editingProduct.product_id}
                  disabled
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleChange}
                  className={`mt-1 w-full border p-2 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-lg`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editingProduct.price}
                  onChange={handleChange}
                  className={`mt-1 w-full border p-2 ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  } rounded-lg`}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={editingProduct.stock}
                  onChange={handleChange}
                  className={`mt-1 w-full border p-2 ${
                    errors.stock ? "border-red-500" : "border-gray-300"
                  } rounded-lg`}
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
                )}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white"
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
