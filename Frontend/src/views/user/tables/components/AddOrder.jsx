import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import InputField from "components/fields/InputField"; // Adjust the path if necessary
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoEllipseSharp } from "react-icons/io5";

// Define Zod schema for order validation
const orderSchema = z.object({
  product_id: z.string().nonempty("Product is required"), // Ensures product selection
  product_quantity: z
    .string() // Ensure the value is a string initially
    .regex(/^\d+$/, "Quantity must be a valid number") // Ensure it's numeric
    .transform((val) => Number(val)) // Transform to a number
    .refine((val) => val > 0, { message: "Quantity must be greater than 0" }), // Validate positive numbers
});

const AddOrder = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderSchema), // Use Zod resolver for form validation
  });

  const [products, setProducts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/superproducts/get-products-from-admin`,{withCredentials:true});
        console.log("Fetched products:", response);
        if (response.data.products.length<=0){
         setProducts([]);
        }
        else{
          setProducts(response.data.products);
        }
      } catch (error) {
        toast.error("Failed to fetch products");
      }
    };

    fetchProducts();

    // Check if dark mode is enabled in localStorage or by class
    const isDarkMode = document.body.classList.contains("dark");
    setDarkMode(isDarkMode);
  }, []);

  const onSubmit = async (data) => {
    try {
      // const token = localStorage.getItem("authToken"); // Assuming the token is stored in localStorage
      console.log(data);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/order/placeorder`,
        {
          product_id: data.product_id,
          product_quantity: data.product_quantity,
          // product_id:data._id
        },
        {
          withCredentials: true, // Optional, if your server uses cookies for authentication
        }
      );

      if (response.data.status === 200) {
        toast.success("Order placed successfully!");
        window.location.reload();
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
    <div className={`p-4 rounded-lg w-full h-full`}>
      <h3 className="text-lg font-bold mb-4">Place a New Order</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Product dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <select
            className={`w-full border rounded-md p-2 ${darkMode ? 'bg-black-900 text-white' : 'bg-white text-black'}`}
            {...register("product_id")}
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {`${product.name} ${product.product_id}`}
              </option>
            ))}
          </select>
          {errors.product_id && (
            <span className="text-red-500 text-sm">{errors.product_id.message}</span>
          )}
        </div>

        {/* Quantity input */}
        <InputField
          label="Quantity"
          placeholder="Enter quantity"
          type="number"
          {...register("product_quantity")}
          error={errors.product_quantity?.message}
        />

        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="mr-4 inline-flex justify-center rounded-md border border-gray-300 py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm ${darkMode ? 'bg-brand-600 hover:bg-brand-500' : 'bg-brand-500 hover:bg-brand-600'} focus:outline-none`}
          >
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrder;
