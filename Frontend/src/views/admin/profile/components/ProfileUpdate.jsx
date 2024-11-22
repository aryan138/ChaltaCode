
import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileUpdate = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Centralized toast configuration
  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    transition: Slide,
    theme: "light"
  };

  // Fetch and pre-fill existing user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/get-details", {
          withCredentials: true
        });
        
        const userData = response.data;
        setValue("user_username", userData.username || "");
        setValue("user_email", userData.email || "");
        setValue("user_fullname", userData.fullName || "");
        setValue("user_phone_number", userData.phoneNumber || "");
        setValue("user_designation", userData.designation || "");
        setValue("user_company_name", userData.companyName || "");
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Remove empty fields
    Object.keys(data).forEach(key => {
      if (data[key] === "") {
        delete data[key];
      }
    });
    
    // Close any existing toasts
    toast.dismiss();

    try {
      console.log("data",data);
      const response = await axios.post(
        "http://localhost:3000/user/update-details", 
        data, 
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Success toast with auto-close and close popup
        toast.success("Profile updated successfully!", {
          ...toastConfig,
          onClose: onClose,
          icon: () => <CheckCircle className="text-green-500" />,
        });

        // Ensure popup closes
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (error) {
      // Error toast
      toast.error(
        error.response?.data?.message || "Failed to update profile. Please try again.",
        {
          ...toastConfig,
          icon: () => <AlertCircle className="text-red-500" />,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle escape key to close the popup
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
        limit={3}
      />

      <div className="bg-white dark:!bg-navy-800 shadow-3xl shadow-shadow-500 rounded-[20px] p-6 relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-white z-50"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white mb-2">
            Update Your Profile
          </h4>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            You can update any of the fields below (all fields are optional)
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Username
              </label>
              <input
                {...register("user_username", { 
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters"
                  }
                })}
                placeholder="Enter your username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
              />
              {errors.user_username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.user_username.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                {...register("user_email", { 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
              />
              {errors.user_email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.user_email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Full Name
              </label>
              <input
                {...register("user_fullname")}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
              />
              {errors.user_fullname && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.user_fullname.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                {...register("user_phone_number", { 
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid phone number"
                  }
                })}
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
              />
              {errors.user_phone_number && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.user_phone_number.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Designation
              </label>
              <input
                {...register("user_designation", { 
                  maxLength: {
                    value: 100,
                    message: "Designation must be less than 100 characters"
                  }
                })}
                placeholder="Enter your designation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
              />
              {errors.user_designation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.user_designation.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Company Name
              </label>
              <input
                {...register("user_company_name", { 
                  maxLength: {
                    value: 100,
                    message: "Company name must be less than 100 characters"
                  }
                })}
                placeholder="Enter your company name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
              />
              {errors.user_company_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.user_company_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex justify-center rounded-md border border-transparent bg-brand-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;