import React from "react";
import Card from "components/card";
import InputField from "../../../../components/fields/InputField"; 
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileUpdate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:3000/user/update-details", data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        alert("Profile updated successfully");
        navigate("/admin/profile"); // Navigate back to profile
        window.location.reload(); // Refresh the page
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <Card className="grid h-full w-full grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-4 font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
      <div className="col-span-1">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          Update Your Profile
        </h4>
        <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          Modify your personal information below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="col-span-1 space-y-4">
        <InputField
          label="Username"
          placeholder="Enter your username"
          {...register("user_username")}
          error={errors.user_username && errors.user_username.message}
        />

        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          {...register("user_email")}
          error={errors.user_email && errors.user_email.message}
        />

        <InputField
          label="Full Name"
          placeholder="Enter your full name"
          {...register("user_fullname")}
          error={errors.user_fullname && errors.user_fullname.message}
        />

        <InputField
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          {...register("user_phone_number")}
          error={errors.user_phone_number && errors.user_phone_number.message}
        />

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-brand-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            Update Profile
          </button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileUpdate;
