import React, { useState, useEffect } from "react";
import axios from "axios";  // Import axios
import Table from "./components/Table";
import Upload from "./components/Upload";
import Storage from "./components/Storage";

const App = () => {
  const [products, setProducts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products/getall");
        console.log("Fetched products:", response.data.products); // Log the fetched data
        setProducts(response.data.products); // Ensure this line uses the correct structure
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);
  

  const handleDataUpdate = async (newData) => {
    try {
      // Update the product by sending the product ID in the URL
      await axios.put(
        `http://localhost:3000/products/update/${editingProduct.product_id}`,  // Send product_id in URL
        {
          name: editingProduct.name,
          price: editingProduct.price,
          stock: editingProduct.stock,
        }
      );
      
      // Update the product list after successful update
      setProducts((prevData) =>
        prevData.map((product) =>
          product.product_id === editingProduct.product_id
            ? editingProduct
            : product
        )
      );
  
      // Close the modal and reset the editing state
      setEditModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  
  };
  

  // Delete product
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/products/delete/${productId}`);  // Delete product from the API
      setProducts((prevData) =>
        prevData.filter((product) => product.product_id !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  // Save edited product
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3000/products/update/${editingProduct.product_id}`, editingProduct);  // Put data to update the product
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

  // Handle input changes for editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2">
        {/* Storage and Upload components */}
        <Storage />
        <Upload onDataUpdate={handleDataUpdate} />
      </div>
      <div className="mt-5 h-full w-full pb-4">
        <Table data={products} onDelete={handleDelete} onEdit={handleEdit} />
      </div>

      {/* Edit Modal */}
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
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editingProduct.price}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={editingProduct.stock}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                />
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
