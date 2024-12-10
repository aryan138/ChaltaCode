import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAdmin } from "useContext/adminContext";

// Zod schema for form validation
const profileUpdateSchema = z.object({
  admin_name: z
    .string()
    .min(3, { message: "Admin name must be at least 3 characters" })
    .max(20, { message: "Admin name must be less than 20 characters" })
    .refine(
      (val) => /^[a-zA-Z0-9 ]+$/.test(val.trim()), // Alphanumeric and spaces only
      { message: "Admin name can only contain letters, numbers, and spaces" }
    )
    .transform((val) => val.trim().replace(/\s+/g, " ")) // Trim and reduce spaces
    .optional(),
  admin_email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional(),
  company_name: z
    .string()
    .max(20, { message: "Company name must be less than 20 characters" })
    .refine(
      (val) => /^[a-zA-Z0-9 ]+$/.test(val.trim()), // Alphanumeric and spaces only
      { message: "Company name can only contain letters, numbers, and spaces" }
    )
    .transform((val) => val.trim().replace(/\s+/g, " ")) // Trim and reduce spaces
    .optional(),
  company_industry: z
    .string()
    .max(20, { message: "Company industry must be less than 20 characters" })
    .refine(
      (val) => /^[a-zA-Z0-9 ]+$/.test(val.trim()), // Alphanumeric and spaces only
      { message: "Company Industry can only contain letters, numbers, and spaces" }
    )
    .transform((val) => val.trim().replace(/\s+/g, " ")) // Trim and reduce spaces
    .optional(),
  company_address: z
    .string()
    .max(100, { message: "Address must be less than 100 characters" })
    .optional(),
});

const ProfileUpdate = ({ onClose }) => {
  const adminInfo = useAdmin();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

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
    theme: "light",
  };

  // Fetch and pre-fill existing user data
  useEffect(() => {

    // useEffect(() => {
      // console.log("Pre-filling company_industry:", adminInfo.company_industry);
      // setValue("company_industry", adminInfo.company_industry || "");
    // }, [adminInfo, setValue]);
    
    // useEffect(() => {
    // console.log("adminInfo:", adminInfo);
    // }, [adminInfo]);

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/admin/get-details",
          {
            withCredentials: true,
          }
        );

        // console.log("adminINfo", adminInfo.company_industry);

        const userData = response.data;
        setValue("admin_name", adminInfo.admin_name || "");
        setValue("admin_email", adminInfo.admin_email || "");
        setValue("admin_mobile_number", adminInfo.admin_mobile_number || "");
        setValue("company_address", adminInfo.company_address || "");
        setValue("company_name", adminInfo.company_name || "");
        setValue("company_industry", adminInfo.company_industry || "");
        
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      // Show preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // console.log("before", data);
    Object.keys(data).forEach((key) => {
      if (data[key] === "") delete data[key];
    });
    // console.log("after", data);

    try {
      const response = await axios.post(
        "http://localhost:3000/admin/profile-complete",
        data,
        { withCredentials: true }
      );

      console.log("data", data);

      if (response.data.success) {
        toast.success("Profile updated successfully!", { ...toastConfig });
        onClose();
      } else {
        toast.error(response.data.message || "Failed to update profile.", {
          ...toastConfig,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.", {
        ...toastConfig,
      });
    } finally {
      setIsSubmitting(false);
      window.location.reload();
    }
  };

  // Handle escape key to close the popup
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <ToastContainer limit={3} />

      <div className="relative rounded-[20px] bg-white p-6 shadow-3xl shadow-shadow-500 dark:!bg-black-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 text-gray-500 hover:text-gray-700 dark:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <h4 className="mb-2 text-2xl font-bold text-black-700 dark:text-white">
            Update Your Profile
          </h4>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            You can update any of the fields below (all fields are optional)
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:rounded-md file:border-0
                file:bg-green-800 file:px-4
                file:py-2 file:text-sm
                file:font-semibold file:text-white
                hover:file:bg-green-700"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="mt-4 h-32 w-32 rounded-full object-cover"
              />
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Admin Name
              </label>
              <input
                {...register("admin_name")}
                placeholder="Enter your name"
                className="w-full rounded-md border px-3 py-2"
              />
              {errors.admin_name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.admin_name.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <input
                {...register("admin_email")}
                placeholder="Enter your email"
                className="w-full rounded-md border px-3 py-2"
              />
              {errors.admin_email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.admin_email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Phone Number
              </label>
              <input
                {...register("admin_mobile_number")}
                placeholder="Enter your phone number"
                className="w-full rounded-md border px-3 py-2"
              />
              {errors.admin_mobile_number && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.admin_mobile_number.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Company Name
              </label>
              <input
                {...register("company_name")}
                placeholder="Enter your company name"
                className="w-full rounded-md border px-3 py-2"
              />
              {errors.company_name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.company_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Company Industry
              </label>
              <input
                {...register("company_industry")}
                placeholder="Enter your company industry"
                className="w-full rounded-md border px-3 py-2"
              />
              {errors.company_industry && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.company_industry.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Company Address
              </label>
              <input
                {...register("company_address")}
                placeholder="Enter your company address"
                className="w-full rounded-md border px-3 py-2"
              />
              {errors.company_address && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.company_address.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex justify-center rounded-md border bg-brand-500 px-4 py-2 text-sm text-white ${
                isSubmitting ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;
