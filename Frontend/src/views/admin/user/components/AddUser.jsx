import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod"; // Import zod for schema validation
import { zodResolver } from "@hookform/resolvers/zod";

const api = axios.create({
  baseURL: 'http://localhost:3001/',
  withCredentials: true // Ensure cookies are sent with requests
});

// Define the Zod schema
const userSchema = z.object({
  // email: z
  //   .string()
  //   .nonempty("Email is required")
  //   .email("Please enter a valid email address")
  //   .refine((email) => !/^\d/.test(email), "Email cannot start with a number") // Email cannot start with a number
  //   .refine((email) => email.trim() === email, "Email cannot have leading or trailing spaces") // No leading or trailing spaces
  //   .transform((email) => email.toLowerCase()),  // Ensure email is stored in lowercase
  // const userSchema = z.object({
    email: z
      .string()
      .nonempty("Email is required")
      .email("Please enter a valid email address")
      .refine((email) => !/^\d/.test(email), "Email cannot start with a number") // Email cannot start with a number
      .refine((email) => email.trim() === email, "Email cannot have leading or trailing spaces") // No leading or trailing spaces
      
      
      
      .transform((email) => email.toLowerCase()), // Convert email to lowercase after validations
  // });
  
  designation: z
    .string()
    .nonempty("Designation is required")
    .regex(/^[A-Za-z\s]+$/, "Designation cannot contain numbers or special characters") // Only alphabets and spaces allowed
    .min(2, "Designation must have at least 2 characters") // Minimum length requirement
    .max(50, "Designation cannot exceed 50 characters") // Maximum length requirement
    .refine((value) => value.trim() === value, "Designation cannot have leading or trailing spaces") // No leading or trailing spaces
    .transform((value) => value.trim().replace(/\s+/g, " ")), // Normalize spaces
});

const AddOrder = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(userSchema), // Use zodResolver to integrate zod validation
  });

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = document.body.classList.contains("dark");
    setDarkMode(isDarkMode);
  }, []);

  const onSubmit = async (data) => {
    try {
      // Validate the data using Zod schema
      // const validatedData = userSchema.parse(data);

      // The token is handled by the browser via cookies (HttpOnly, Secure)
      const response = await api.post(
        "http://localhost:3000/admin/create-user", 
        {
          user_email: data.email,
          user_designation:data.designation,
        },
        {
          // No need to manually add the token here, it will be sent automatically
          withCredentials: true, 
        }
      );

      if (response.data.success) {
        toast.success("User created successfully!");
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      
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
      className={`h-full w-full rounded-lg p-4 shadow-lg ${darkMode ? "bg-black-800 text-white" : "bg-white text-black-700"}`}
    >
      <h3 className="mb-4 text-lg font-bold">Add a New User</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* User's Email input */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">User's Email</label>
          <input
            type="email"
            placeholder="Enter User's Email"
            className={`w-full rounded-md border p-2 ${darkMode ? "bg-black-900 text-white" : "text-black bg-white"}`}
            {...register("email")}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
        </div>

        {/* User's Designation input */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">User's Designation</label>
          <input
            type="text"
            placeholder="Enter User's Designation"
            className={`w-full rounded-md border p-2 ${darkMode ? "bg-black-900 text-white" : "text-black bg-white"}`}
            {...register("designation")}
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
            className={`border-transparent inline-flex justify-center rounded-md border px-4 py-2 text-sm font-medium text-white shadow-sm ${darkMode ? "bg-brand-600 hover:bg-brand-500" : "bg-brand-500 hover:bg-brand-600"} focus:outline-none`}
          >
            Add User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrder;