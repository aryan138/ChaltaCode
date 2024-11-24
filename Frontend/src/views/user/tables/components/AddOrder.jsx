import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import InputField from "components/fields/InputField"; // Adjust the path if necessary
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddOrder = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [products, setProducts] = useState([]);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/superproducts/getall");
        console.log("Fetched products:", response.data.products);
        setProducts(response.data.products);
        console.log("aande products:",products)
      } catch (error) {
        toast.error("Failed to fetch products");
      }
    };
  
    fetchProducts();
  });
  

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("authToken");  // Assuming the token is stored in localStorage
      const response = await axios.post(
        "http://localhost:3000/order/placeorder",
        {
          product_id: data.product_id,
          product_quantity: data.product_quantity,
          id:data._id
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`  // Attach the token here
          },
          withCredentials: true,  // Optional, if your server uses cookies for authentication
        }
      );
  
      if (response.data.status === 200) {
        toast.success("Order placed successfully!");
        window.location.reload();
        // navigate("//order-tables");
        
      } else {
        toast.error(response.data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Error while placing the order:", error);
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };
  

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full h-full">
      <h3 className="text-lg font-bold text-navy-700 mb-4">Place a New Order</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Product dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            {...register("product_id", { required: "Product is required" })}
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {`${product.name} ${product.product_id}`}
              </option>
            ))}
          </select>
          {errors.product_id && (
            <span className="text-red-500 text-sm">
              {errors.product_id.message}
            </span>
          )}
        </div>

        {/* Quantity input */}
        <InputField
          label="Quantity"
          placeholder="Enter quantity"
          type="number"
          {...register("product_quantity", {
            required: "Quantity is required",
            min: {
              value: 1,
              message: "Quantity must be at least 1",
            },
          })}
          error={errors.product_quantity?.message}
        />

        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="mr-4 inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-brand-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrder;