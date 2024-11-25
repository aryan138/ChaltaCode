import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputField from "components/fields/InputField";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Zod schemas
const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const adminSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignUp() {
  const [userType, setUserType] = useState("user");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const forms = {
    user: useForm({ resolver: zodResolver(userSchema) }),
    admin: useForm({ resolver: zodResolver(adminSchema) }),
  };

  const handleSignUp = async (data) => {
    setLoading(true);
    const endpoint = userType === "user" ? "/user/register" : "/admin/sign-in";
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}${endpoint}`,
        data,
        { withCredentials: true }
      );
      if (response.data.success) {
        navigate(userType === "user" ? "/user" : "/admin-dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="top-0 w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-black-700 dark:text-white">
          {userType === "user" ? "User Sign Up" : "Admin Sign Up"}
        </h4>

        <label className="mb-2 block text-base font-medium text-gray-700">
          Sign up as:
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="ml-2 rounded-md border-gray-300 text-sm text-gray-700"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <form onSubmit={forms[userType].handleSubmit(handleSignUp)}>
          <InputField
            label="Username"
            placeholder="Enter your username"
            {...forms[userType].register("username")}
          />
          {forms[userType].formState.errors.username && (
            <p className="text-red-500 text-sm">{forms[userType].formState.errors.username.message}</p>
          )}

          <InputField
            label="Email"
            placeholder="Enter your email"
            {...forms[userType].register("email")}
          />
          {forms[userType].formState.errors.email && (
            <p className="text-red-500 text-sm">{forms[userType].formState.errors.email.message}</p>
          )}

          <InputField
            label="Password"
            placeholder="Enter your password"
            type="password"
            {...forms[userType].register("password")}
          />
          {forms[userType].formState.errors.password && (
            <p className="text-red-500 text-sm">{forms[userType].formState.errors.password.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 ${
              loading ? "cursor-not-allowed bg-gray-500" : "hover:bg-brand-600 active:bg-brand-700"
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4">
          <span className="text-sm font-medium text-black-700 dark:text-gray-600">
            Already have an account?
          </span>
          <Link
            to={"/auth/sign-in"}
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
