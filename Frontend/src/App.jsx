import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import Landing from "layouts/Landing/index.jsx";
import CreateInvoice from "views/admin/invoice/components/CreateInvoice";

const App = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="rtl/*" element={<RtlLayout />} />
      <Route path="/" element={<Landing/>}/>
      <Route path="/admin/invoice/create-invoice" element={<CreateInvoice/>}/>
    </Routes>
  );
};

export default App;
