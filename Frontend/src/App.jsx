import React from "react";
import { Routes, Route } from "react-router-dom";
import UserLayout from "layouts/user";
import AuthLayout from "layouts/auth";
import Landing from "layouts/Landing/index.jsx";
// import CreateInvoice from "views/user/invoice/components/CreateInvoice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div>
      <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="user/*" element={<UserLayout />} />
      <Route path="/" element={<Landing />} />
      {/* <Route path="/user/invoice/create-invoice" element={<CreateInvoice />} /> */}
    </Routes>
    <ToastContainer/>
    </div>
  );
};

export default App;
