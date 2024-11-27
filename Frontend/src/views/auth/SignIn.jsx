// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import InputField from "components/fields/InputField";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Zod schemas
// const userSignInSchema = z.object({
//   user_email: z.string().email("Invalid email address"),
//   user_password: z.string().min(8, "Password must be at least 8 characters"),
// });

// const adminSignInSchema = z.object({
//   admin_email: z.string().email("Invalid email address"),
//   admin_password: z.string().min(8, "Password must be at least 8 characters"),
// });

// export default function SignIn() {
//   const navigate = useNavigate();
//   const [role, setRole] = useState("user");

//   const userForm = useForm({
//     resolver: zodResolver(userSignInSchema),
//   });

//   const adminForm = useForm({
//     resolver: zodResolver(adminSignInSchema),
//   });

//   const handleRoleChange = (event) => {
//     setRole(event.target.value);
//   };

//   const handleSignInForUser = async (data) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/user/sign-in",
//         data,
//         { withCredentials: true }
//       );
//       if (response.data.success) {
//         toast.success("Successfully signed in!", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         setTimeout(() => {
//           navigate("/user");
//         }, 1000);
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.error || "An error occurred during sign in",
//         { position: "top-right", autoClose: 3000 }
//       );
//     }
//   };

//   const handleSignInForAdmin = async (data) => {
//     try {
//       const response = await axios.post("http://localhost:3000/admin/sign-in", data);
//       if (response.data.success) {
//         toast.success("Successfully signed in as admin!", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         setTimeout(() => {
//           navigate("/admin-dashboard");
//         }, 1000);
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.error || "An error occurred during sign in",
//         { position: "top-right", autoClose: 3000 }
//       );
//     }
//   };

//   return (
//     <div className="-mt-12 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
//       <ToastContainer />
//       <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
//         <h4 className="mb-2.5 text-4xl font-bold text-black-700 dark:text-white">
//           {role === "user" ? "User Sign In" : "Admin Sign In"}
//         </h4>

//         <label className="mb-2 block text-base font-medium text-gray-700">
//           Sign in as:
//           <select
//             value={role}
//             onChange={handleRoleChange}
//             className="ml-2 rounded-md border-gray-300 text-sm text-gray-700"
//           >
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//         </label>

//         {role === "user" ? (
//           <form onSubmit={userForm.handleSubmit(handleSignInForUser)}>
//             <InputField
//               label="Email"
//               placeholder="Enter your email"
//               {...userForm.register("user_email")}
//               error={userForm.formState.errors.user_email?.message}
//             />
//             <InputField
//               label="Password"
//               placeholder="Enter your password"
//               type="password"
//               {...userForm.register("user_password")}
//               error={userForm.formState.errors.user_password?.message}
//             />
//             <button
//               type="submit"
//               className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
//             >
//               Sign In
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={adminForm.handleSubmit(handleSignInForAdmin)}>
//             <InputField
//               label="Email"
//               placeholder="Enter your email"
//               {...adminForm.register("admin_email")}
//               error={adminForm.formState.errors.admin_email?.message}
//             />
//             <InputField
//               label="Password"
//               placeholder="Enter your password"
//               type="password"
//               {...adminForm.register("admin_password")}
//               error={adminForm.formState.errors.admin_password?.message}
//             />
//             <button
//               type="submit"
//               className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
//             >
//               Sign In
//             </button>
//           </form>
//         )}

//         <div className="mt-4">
//           <span className="text-sm font-medium text-black-700 dark:text-gray-600">
//             Don't have an account?
//           </span>
//           <Link
//             to={"/auth/sign-up"}
//             className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
//           >
//             Sign Up
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Zod schemas
const userSignInSchema = z.object({
  user_email: z.string().email("Invalid email address"),
  user_password: z.string().min(8, "Password must be at least 8 characters"),
});

const adminSignInSchema = z.object({
  admin_email: z.string().email("Invalid email address"),
  admin_password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignIn() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");

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
          navigate("/user");
        }, 1000);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "An error occurred during sign in",
        { position: "top-right", autoClose: 3000 }
      );
    }
  };

  const handleSignInForAdmin = async (data) => {
    try {
      const response = await axios.post("http://localhost:3000/admin/login", data);
      console.log(response.data);
      if (response.data.success) {
        toast.success("Successfully signed in as admin!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/admin/default");
        }, 1000);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "An error occurred during sign in",
        { position: "top-right", autoClose: 3000 }
      );
    }
  };

  return (
    <div className="-mt-12 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <ToastContainer />
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
              label="Email"
              placeholder="Enter your email"
              {...adminForm.register("admin_email")}
              error={adminForm.formState.errors.admin_email?.message}
            />
            <InputField
              label="Password"
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