import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = axios.create({
  baseURL: 'http://localhost:3001/',
  withCredentials: true // Ensure cookies are sent with requests
});

const AddOrder = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = document.body.classList.contains("dark");
    setDarkMode(isDarkMode);
  }, []);

  const onSubmit = async (data) => {
    try {
      // The token is handled by the browser via cookies (HttpOnly, Secure)
      const response = await api.post(
        "http://localhost:3000/admin/create-user", 
        {
          user_email: data.email,
          user_designation: data.designation,
        },
        {
          // No need to manually add the token here, it will be sent automatically
          withCredentials: true, 
        }
      );

      if (response.data.success) {
        toast.success("User created successfully!");
        onClose();
      } else {
        toast.error(response.data.message || "Failed to create user.");
      }
    } catch (error) {
      console.error("Error while creating the user:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className={`h-full w-full rounded-lg p-4 shadow-lg ${
        darkMode ? "bg-black-800 text-white" : "bg-white text-black-700"
      }`}
    >
      <h3 className="mb-4 text-lg font-bold">Add a New User</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* User's Email input */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">User's Email</label>
          <input
            type="email"
            placeholder="Enter User's Email"
            className={`w-full rounded-md border p-2 ${
              darkMode ? "bg-black-900 text-white" : "text-black bg-white"
            }`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
        </div>

        {/* User's Designation input */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">
            User's Designation
          </label>
          <input
            type="text"
            placeholder="Enter User's Designation"
            className={`w-full rounded-md border p-2 ${
              darkMode ? "bg-black-900 text-white" : "text-black bg-white"
            }`}
            {...register("designation", {
              required: "Designation is required",
            })}
          />
          {errors.designation && (
            <span className="text-sm text-red-500">
              {errors.designation.message}
            </span>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="mr-4 inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`border-transparent inline-flex justify-center rounded-md border px-4 py-2 text-sm font-medium text-white shadow-sm ${
              darkMode
                ? "bg-brand-600 hover:bg-brand-500"
                : "bg-brand-500 hover:bg-brand-600"
            } focus:outline-none`}
          >
            Add User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrder;
