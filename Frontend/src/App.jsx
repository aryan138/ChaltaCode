import React from "react";
import { Routes, Route } from "react-router-dom";
import UserLayout from "layouts/user";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import Landing from "layouts/Landing/index.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div>
      <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="user/*" element={<UserLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="/" element={<Landing />} />
    </Routes>
    <ToastContainer/>
    </div>
  );
};

export default App;
