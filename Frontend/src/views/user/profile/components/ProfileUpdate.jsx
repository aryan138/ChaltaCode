import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { useUser } from "useContext/userContext";

const ProfileUpdate = ({ onClose }) => {
  const userInfo = useUser();
  const [formData, setFormData] = useState({
    user_username: "Username", // Default fallback
    user_email: "Email",
    user_fullname: "Name",
    user_phone_number: "Phone Number",
    user_designation: "Designation",
    user_company_name: "Company Name",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Fetch and pre-fill existing user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/user/get-details",
          { withCredentials: true }
        );

        const userData = response.data;

        // Update form data with fetched values or defaults
        setFormData({
          user_email: userInfo.user_email || "Email",
          user_fullname: userInfo.user_fullname || "Name",
          user_phone_number: userInfo.user_phone_number || "Phone Number",
          user_designation: userInfo.user_designation || "Designation",
          user_company_name: userInfo.user_company_name || "Company Name",
        });
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateFields = () => {
    const errors = {};

    // Email: cannot start with a number
    const emailRegex = /^[^\d][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.user_email || !emailRegex.test(formData.user_email)) {
      errors.user_email = "Email cannot start with a number and must be valid";
    }

    // Full Name: cannot be just spaces and cannot contain numbers
    const nameRegex = /\d/; // Regex to detect numbers
    if (!formData.user_fullname.trim()) {
      errors.user_fullname = "Full Name cannot be empty or just spaces";
    } else if (nameRegex.test(formData.user_fullname)) {
      errors.user_fullname = "Full Name cannot contain numbers";
    }

    // Phone Number: should only contain 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!formData.user_phone_number || !phoneRegex.test(formData.user_phone_number)) {
      errors.user_phone_number = "Phone Number must be 10 digits";
    }

    // Designation: cannot be just spaces and cannot contain numbers
    if (!formData.user_designation.trim()) {
      errors.user_designation = "Designation cannot be empty or just spaces";
    } else if (nameRegex.test(formData.user_designation)) {
      errors.user_designation = "Designation cannot contain numbers";
    }

    // Company Name: cannot be just spaces and cannot contain numbers
    if (!formData.user_company_name.trim()) {
      errors.user_company_name = "Company Name cannot be empty or just spaces";
    } else if (nameRegex.test(formData.user_company_name)) {
      errors.user_company_name = "Company Name cannot contain numbers";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/user/update-details",
        formData,
        { withCredentials: true }
      );

      // if (response.status === 200) {
      //   alert("Profile updated successfully!");
      //   onClose();
      // }
      if (response.status === 200) {
        alert("Profile updated successfully!");
        // Refresh the page after successful update
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h4 className="text-2xl font-bold mb-4">Update Your Profile</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="user_email"
                value={formData.user_email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.user_email && (
                <p className="text-red-500 text-xs">{errors.user_email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                name="user_fullname"
                value={formData.user_fullname}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.user_fullname && (
                <p className="text-red-500 text-xs">{errors.user_fullname}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                name="user_phone_number"
                value={formData.user_phone_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.user_phone_number && (
                <p className="text-red-500 text-xs">{errors.user_phone_number}</p>
              )}
            </div>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Designation</label>
              <input
                name="user_designation"
                value={formData.user_designation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.user_designation && (
                <p className="text-red-500 text-xs">{errors.user_designation}</p>
              )}
            </div>  

            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <input
                name="user_company_name"
                value={formData.user_company_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.user_company_name && (
                <p className="text-red-500 text-xs">{errors.user_company_name}</p>
              )}
            </div>
          </div> */}

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white bg-blue-500 rounded-md ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
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
