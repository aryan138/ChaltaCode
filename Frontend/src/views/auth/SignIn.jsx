
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputField from "components/fields/InputField";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi"; 


// Zod schemas
// const userSignInSchema = z.object({
//   user_email: z.string().email("Invalid email address"),
//   user_password: z.string().min(8, "Password must be at least 8 characters"),
// });

// const adminSignInSchema = z.object({
//   admin_email: z.string().email("Invalid email address"),
//   admin_password: z.string().min(8, "Password must be at least 8 characters"),
// });

const emailValidation = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address")
  .max(100, "Email must not exceed 100 characters")
  .refine(
    (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
    "Invalid email format"
  )
  .refine(
    (email) => {
      const blockedDomains = ["tempmail.com", "10minutemail.com", "disposablemail.com"];
      return !blockedDomains.some((domain) => email.endsWith(domain));
    },
    "Disposable email addresses are not allowed"
  );

// Common reusable password checks
const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password cannot exceed 64 characters")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
    "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
  )
  .refine(
    (password) => {
      const commonPasswords = [
        "password",
        "123456",
        "123456789",
        "qwerty",
        "password123",
        "12345678",
        "admin123",
      ];
      return !commonPasswords.includes(password.toLowerCase());
    },
    "This password is too common and is not allowed"
  );

// User Sign-In Schema
const userSignInSchema = z.object({
  user_email: emailValidation,
  user_password: passwordValidation,
});

// Admin Sign-In Schema
const adminSignInSchema = z.object({
  admin_email: emailValidation,
  admin_password: passwordValidation,
});




export default function SignIn() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); 


  const userForm = useForm({
    resolver: zodResolver(userSignInSchema),

  });

  const adminForm = useForm({
    resolver: zodResolver(adminSignInSchema),
  });

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSignInForUser = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/user/sign-in",
        data,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Successfully signed in!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/user/default");
        }, 1000);
      }
      else{
        toast.error(
          response.data.error,
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error,
      );
    }finally {
      setLoading(false);
    }
  };

  const handleSignInForAdmin = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/admin/login", data,{withCredentials: true });
      // console.log(response.data);
      if (response.data.success) {
        toast.success("Successfully signed in as admin!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/admin/default");
        }, 1000);
      }
      else{
        toast.error(response.data.error ,{ position: "top-right", autoClose: 3000 });

      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "An error occurred during sign in",
        { position: "top-right", autoClose: 3000 }
      );
    }finally {
      setLoading(false); 
    }
  };

  const SubmitButton = () => (
    <button
      type="submit"
      disabled={loading}
      className={`linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 
        ${loading 
          ? "cursor-not-allowed opacity-70" 
          : "hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        }`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
          <span>Signing in...</span>
        </div>
      ) : (
        "Sign In"
      )}
    </button>
  );

  return (
    <div className="-mt-12 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-black-700 dark:text-white">
          {role === "user" ? "User Sign In" : "Admin Sign In"}
        </h4>

        <label className="mb-2 block text-base font-medium text-gray-700 dark:text-white">
          Sign in as:
          <select
            value={role}
            onChange={handleRoleChange}
            className=" mt-3 py-3 w-full rounded-md border-gray-50 border-[0.1rem]  text-sm text-gray-700 dark:text-white dark:bg-[#0d0d0d]"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        {role === "user" ? (
          <form onSubmit={userForm.handleSubmit(handleSignInForUser)}>
            <InputField
              label="Email"
              placeholder="Enter your email"
              {...userForm.register("user_email")}
              error={userForm.formState.errors.user_email?.message}
            />
            <div className="relative mb-4"> {/* Add relative positioning to wrap input and eye button */}
              <InputField
                label="Password"
                placeholder="Enter your password"
                type={passwordVisible ? "text" : "password"} // Toggle password visibility
                {...userForm.register("user_password")}
                error={userForm.formState.errors.user_password?.message}
                className="pr-10" // Add padding to the right to make space for the eye button
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
                className="absolute right-3 top-14 transform -translate-y-1/2 text-gray-600"
              >
                {passwordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            <SubmitButton />
          </form>
        ) : (
          <form onSubmit={adminForm.handleSubmit(handleSignInForAdmin)}>
            <InputField
              label="Email"
              placeholder="Enter your email"
              {...adminForm.register("admin_email")}
              error={adminForm.formState.errors.admin_email?.message}
            />
            <div className="relative mb-4"> {/* Add relative positioning to wrap input and eye button */}
              <InputField
                label="Password"
                placeholder="Enter your password"
                type={passwordVisible ? "text" : "password"} // Toggle password visibility
                {...adminForm.register("admin_password")}
                error={adminForm.formState.errors.admin_password?.message}
                className="pr-10" // Add padding to the right to make space for the eye button
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
                className="absolute right-3 top-14 transform -translate-y-1/2 text-gray-600"
              >
                {passwordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            <SubmitButton />
          </form>
        )}

        <div className="mt-4">
          {/* <span className="text-sm font-medium text-black-700 dark:text-gray-600">
            Don't have an account?
          </span> */}
          <Link
            to={"/auth/"}
            className=" text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Forgot Password ?
          </Link>
        </div>

        <div className="mt-4">
          <span className="text-sm font-medium text-black-700 dark:text-gray-600">
            Don't have an account?
          </span>
          <Link
            to={"/auth/sign-up"}
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

