// import { useState } from "react";
// import InputField from "components/fields/InputField";
// import { FcGoogle } from "react-icons/fc";
// import { Link } from "react-router-dom";

// export default function SignUp() {
//   const [role, setRole] = useState("user");

//   const handleRoleChange = (event) => {
//     setRole(event.target.value);
//   };

//   return (
//     <div className="mt-3 mb-10 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
//       <div className="top-0 w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
//         {/* Role Selection */}
//         <div className="mb-4">
//           <select
//             id="role"
//             value={role}
//             onChange={handleRoleChange}
//             className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 dark:border-gray-600 dark:bg-navy-800 dark:text-white"
//           >
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         {/* Conditional Form Rendering */}
//         {role === "user" ? (
//           <div>
//             <h4 className="mb-2.5 text-3xl font-bold text-navy-700 dark:text-white">
//               User Sign Up
//             </h4>
//             <p className="mb-0 ml-1 text-base text-gray-600">
//               Enter your details to sign up!
//             </p>
//             <InputField
//               variant="auth"
//               extra="mb-3"
//               label="Username"
//               placeholder="john_doe"
//               id="username"
//               type="text"
//             />
//             <InputField
//               variant="auth"
//               extra="mb-3"
//               label="Email"
//               placeholder="mail@simmmple.com"
//               id="email"
//               type="text"
//             />
//             <InputField
//               variant="auth"
//               extra="mb-3"
//               label="Password"
//               placeholder="Min. 8 characters"
//               id="password"
//               type="password"
//             />
//             <InputField
//               variant="auth"
//               extra="mb-3"
//               label="Admin Reference"
//               placeholder="Admin ID"
//               id="admin_ref"
//               type="text"
//             />
//             <InputField
//               variant="auth"
//               extra="mb-3"
//               label="Branch ID"
//               placeholder="Branch ID"
//               id="branch_id"
//               type="text"
//             />
//             <Link to={'/admin'}>
//               <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
//                 Sign Up
//               </button>
//             </Link>
//             <div className="mt-4">
//               <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
//                 Already have an account?
//               </span>
//               <Link to={'/auth/sign-in'}
//                 className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
//               >
//                 sign in
//               </Link>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
//               Admin Sign Up
//             </h4>
//             <p className="mb-9 ml-1 text-base text-gray-600">
//               Enter your details to create an admin account!
//             </p>
            
//             <InputField
//               variant="auth"
//               extra="mb-3"
//               label="Username"
//               placeholder="admin_username"
//               id="username"
//               type="text"
//             />
//             <InputField
//               variant="auth"
//               extra="mb-3"
//               label="Email"
//               placeholder="admin@mail.com"
//               id="email"
//               type="text"
//             />
//             <InputField
//               variant="auth"
//               extra="mb-3"
//               label="Password"
//               placeholder="Min. 8 characters"
//               id="password"
//               type="password"
//             />
//             <Link to={'/admin/dashboard'}>
//               <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
//                 Sign Up
//               </button>
//             </Link>
//             <div className="mt-4">
//               <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
//                 Already have an account?
//               </span>
//               <Link to={'/auth/sign-in'}
//                 className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
//               >
//                 sign in
//               </Link>
//             </div>
//           </div>
//         )}
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

// Zod schemas for user and admin
const userSchema = z.object({
  user_username: z.string().min(1, "Username is required"),
  user_email: z.string().email("Invalid email address"),
  user_password: z.string().min(8, "Password must be at least 8 characters"),
  admin_ref: z.string().min(1, "Admin Reference is required"),
  branch_id: z.union([
    z.string().length(24, "Branch ID must be a 24-character hex string"),
    z.instanceof(Uint8Array).refine((arr) => arr.length === 12, {
      message: "Branch ID must be a 12-byte Uint8Array",
    }),
    z.number().int("Branch ID must be an integer"),
  ]),
});

const adminSchema = z.object({
  user_name: z.string().min(1, "Username is required"),
  admin_email: z.string().email("Invalid email address"),
  admin_password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignUp() {
  const [userType, setUserType] = useState("user");
  const navigate = useNavigate();

  const userForm = useForm({
    resolver: zodResolver(userSchema),
  });

  const adminForm = useForm({
    resolver: zodResolver(adminSchema),
  });

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSignUpForUser = async (data) => {
    try {
      const response = await axios.post("http://localhost:3000/user/register", data);
      console.log(response.data);
      if (response.data.success) {
        navigate('/admin');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignUpForAdmin = async (data) => {
    try {
      const response = await axios.post("http://localhost:3000/admin/register", data);
      console.log(response.data);
      if (response.data.success) {
        navigate('/admin/dashboard');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="mt-6 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="top-0 w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          {userType === "user" ? "User Sign Up" : "Admin Sign Up"}
        </h4>

        <label className="mb-2 block text-base font-medium text-gray-700">
          Sign up as:
          <select
            value={userType}
            onChange={handleUserTypeChange}
            className="ml-2 rounded-md border-gray-300 text-sm text-gray-700"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        {userType === "user" ? (
          <form onSubmit={userForm.handleSubmit(handleSignUpForUser)}>
            <InputField
              label="Username"
              placeholder="Enter your username"
              {...userForm.register("user_username")}
            />
            {userForm.formState.errors.user_username && (
              <p className="text-red-500 text-sm">
                {userForm.formState.errors.user_username.message}
              </p>
            )}
            <InputField
              label="Email"
              placeholder="Enter your email"
              {...userForm.register("user_email")}
            />
            {userForm.formState.errors.user_email && (
              <p className="text-red-500 text-sm">
                {userForm.formState.errors.user_email.message}
              </p>
            )}
            <InputField
              label="Password"
              placeholder="Enter your password"
              type="password"
              {...userForm.register("user_password")}
            />
            {userForm.formState.errors.user_password && (
              <p className="text-red-500 text-sm">
                {userForm.formState.errors.user_password.message}
              </p>
            )}
            <InputField
              label="Admin Reference"
              placeholder="Enter admin reference"
              {...userForm.register("admin_ref")}
            />
            {userForm.formState.errors.admin_ref && (
              <p className="text-red-500 text-sm">
                {userForm.formState.errors.admin_ref.message}
              </p>
            )}
            <InputField
              label="Branch ID"
              placeholder="Enter branch ID"
              {...userForm.register("branch_id")}
            />
            {userForm.formState.errors.branch_id && (
              <p className="text-red-500 text-sm">
                {userForm.formState.errors.branch_id.message}
              </p>
            )}
            <button
              type="submit"
              className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >
              Sign Up
            </button>
          </form>
        ) : (
          <form onSubmit={adminForm.handleSubmit(handleSignUpForAdmin)}>
            <InputField
              label="Username"
              placeholder="Enter your username"
              {...adminForm.register("user_name")}
            />
            {adminForm.formState.errors.user_name && (
              <p className="text-red-500 text-sm">
                {adminForm.formState.errors.user_name.message}
              </p>
            )}
            <InputField
              label="Email"
              placeholder="Enter your email"
              {...adminForm.register("admin_email")}
            />
            {adminForm.formState.errors.admin_email && (
              <p className="text-red-500 text-sm">
                {adminForm.formState.errors.admin_email.message}
              </p>
            )}
            <InputField
              label="Password"
              placeholder="Enter your password"
              type="password"
              {...adminForm.register("admin_password")}
            />
            {adminForm.formState.errors.admin_password && (
              <p className="text-red-500 text-sm">
                {adminForm.formState.errors.admin_password.message}
              </p>
            )}
            <button
              type="submit"
              className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >
              Sign Up
            </button>
          </form>
        )}

        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
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

