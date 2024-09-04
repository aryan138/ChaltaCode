import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "components/fields/InputField";
 // Adjust the path if necessary
 import { ToastContainer, toast } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';

const AddOrder = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const navigate = useNavigate();


  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/order/placeorder",
        data,
        { withCredentials: true }
      );
      if (response.data.status === 200) {
        alert("Order placed successfully!");
        // onOrderSuccess();
        onClose();
        navigate('/admin/order-tables');
        window.location.reload();
        
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full h-full">
      <h3 className="text-lg font-bold text-navy-700 mb-4">Place a New Order</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Product Name"
          placeholder="Enter product name"
          {...register("product_name", { required: "Product name is required" })}
          error={errors.product_name?.message}
        />
        <InputField
          label="Quantity"
          placeholder="Enter quantity"
          type="number"
          {...register("product_quantity", {
            required: "Quantity is required",
            min: {
              value: 1,
              message: "Quantity must be at least 1"
            }
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
