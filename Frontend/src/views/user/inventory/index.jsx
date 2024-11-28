import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "./components/Table";
import Upload from "./components/Upload";
import Storage from "./components/Storage";
import { Search } from "lucide-react";
import EditProductModal from "./components/EditProductModal"; // Import the new modal component

const Inventory = ({ userRole }) => {  // Accept userRole as a prop
  const [products, setProducts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products from the API based on user role
  useEffect(() => {
    const fetchProducts = async () => {
      const endpoint = userRole === "admin" 
        ? "http://localhost:3000/superproducts/getall"
        : "http://localhost:3000/products/getall";

      try {
        const response = await axios.get(endpoint);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [userRole]);  // Re-fetch products if userRole changes

  // Apply overflow hidden and blur effect when modal is open
  useEffect(() => {
    if (editModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [editModalOpen]);

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
    const priceRegex = /^(?!0(\.0+)?$)\d+(\.\d+)?$/;
    const stockRegex = /^[0-9]+$/;

    if (!editingProduct.name || !nameRegex.test(editingProduct.name)) {
      newErrors.name = "Name must contain only letters and spaces.";
    }
    if (!editingProduct.price || !priceRegex.test(editingProduct.price)) {
      newErrors.price = "Price must be greater than zero";
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

    const endpoint = userRole === "admin" 
      ? `http://localhost:3000/superproducts/update/${editingProduct.product_id}`
      : `http://localhost:3000/products/update/${editingProduct.product_id}`;

    try {
      await axios.put(endpoint, editingProduct);
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
    const endpoint = userRole === "admin" 
      ? `http://localhost:3000/superproducts/delete/${productId}`
      : `http://localhost:3000/products/delete/${productId}`;

    try {
      await axios.delete(endpoint);
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

  // Close modal if clicked outside
  const handleCloseModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setEditModalOpen(false);
    }
  };

  // Handle data update from Upload component
  const handleDataUpdate = (newProductData) => {
    setProducts((prevData) => [...prevData, ...newProductData]);
  };

  return (
    <div className={`container mx-auto py-8 ${editModalOpen ? "modal-open" : ""}`}>
      <main>
        <div className={`mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2`}>
          <Storage />
          <Upload onDataUpdate={handleDataUpdate} userRole={userRole} />
        </div>

        {/* Search Input */}
        <div className="my-4 flex items-center rounded-lg border border-gray-300 bg-white hover:border-brand-500 hover:ring-2 hover:ring-brand-500 focus-within:ring-2 focus-within:ring-brand-500">
          <span className="pl-3 text-gray-400">
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder="Search by ID or Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-1 w-full rounded-lg border-none bg-white p-2 pl-10 outline-none"
          />
        </div>

        <div className="mt-5 h-full w-full overflow-auto rounded-lg bg-white dark:bg-black-800">
          <Table
            data={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      {/* Edit Product Modal */}
      <EditProductModal
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
        editingProduct={editingProduct}
        handleChange={handleChange}
        errors={errors}
        handleSave={handleSave}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default Inventory;
