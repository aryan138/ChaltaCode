// import InputField from "components/fields/InputField";
// import { FcGoogle } from "react-icons/fc";
// import Checkbox from "components/checkbox";
// import { Link } from "react-router-dom";

// export default function SignIn() {
//   return (
//     <div className="-mt-12 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
//       {/* Sign in section */}
//       <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
//         <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
//           Sign In
//         </h4>
//         <p className="mb-9 ml-1 text-base text-gray-600">
//           Enter your email and password to sign in!
//         </p>
//         {/* Email */}
//         <InputField
//           variant="auth"
//           extra="mb-3"
//           label="Email*"
//           placeholder="mail@simmmple.com"
//           id="email"
//           type="text"
//         />

//         {/* Password */}
//         <InputField
//           variant="auth"
//           extra="mb-3"
//           label="Password*"
//           placeholder="Min. 8 characters"
//           id="password"
//           type="password"
//         />
//         {/* Checkbox */}
//         <div className="mb-4 flex items-center justify-between px-2">
          
//           <a
//             className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
//             href=" "
//           >
//             Forgot Password?
//           </a>
//         </div>
//         <Link to={'/admin'}>
//         <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
//           Sign In
//         </button>
//         </Link>
        
//         <div className="mt-4">
//           <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
//             Not registered yet?
//           </span>
//           <Link to={'/auth/sign-up'}
//             href=" "
//             className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
//           >
//             Create an account
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputField from "components/fields/InputField";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Zod schema for Sign In
const signInSchema = z.object({
  user_email: z.string().email("Invalid email address").optional(),
  user_password: z.string().min(8, "Password must be at least 8 characters").optional(),
  admin_email: z.string().email("Invalid email address").optional(),
  admin_password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

export default function SignIn() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");


  const userForm = useForm({
    resolver: zodResolver(signInSchema.pick({ user_email: true, user_password: true })),
  });

  const adminForm = useForm({
    resolver: zodResolver(signInSchema.pick({ admin_email: true, admin_password: true })),
  });

  // Handle role change
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  // Handle form submission for User
  const handleSignInForUser = async (data) => {
    try {
      const response = await axios.post("http://localhost:3000/user/sign-in", data,
        {
          withCredentials: true, // Required to include cookies in requests
        }
      );
      if (response.data.success) {
        navigate("/admin");
      }
    } catch (error) {
      // alert(error.message);
      alert(error.response.data.error);
    }
  };

  // Handle form submission for Admin
  const handleSignInForAdmin = async (data) => {
    try {
      const response = await axios.post("http://localhost:3000/admin/sign-in", data);
      if (response.data.success) {
        navigate("/admin-dashboard");
      } 
    } catch (error) {
      // alert(error.message);
      alert(error.response.data.error);
    }
  };
  // const props = {label : "admin"}

  return (
    <div className="-mt-12 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign In Section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          {role === "user" ? "User Sign In" : "Admin Sign In"}
        </h4>

        <label className="mb-2 block text-base font-medium text-gray-700">
          Sign in as:
          <select
            value={role}
            onChange={handleRoleChange}
            className="ml-2 rounded-md border-gray-300 text-sm text-gray-700"
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
            <InputField
              label="Password"
              placeholder="Enter your password"
              type="password"
              {...userForm.register("user_password")}
              error={userForm.formState.errors.user_password?.message}
            />
            <button
              type="submit"
              className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={adminForm.handleSubmit(handleSignInForAdmin)}>
            <InputField
              label="Email*"
              placeholder="Enter your email"
              {...adminForm.register("admin_email")}
              error={adminForm.formState.errors.admin_email?.message}
            />
            <InputField
              label="Password*"
              placeholder="Enter your password"
              type="password"
              {...adminForm.register("admin_password")}
              error={adminForm.formState.errors.admin_password?.message}
            />
            <button
              type="submit"
              className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >
              Sign In
            </button>
          </form>
        )}

        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
            Already have an account?
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





