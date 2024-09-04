import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import RTLDefault from "views/rtl/default";
import Inventory from "views/admin/inventory";
import Invoice from "views/admin/invoice";

// Auth Imports
import SignIn from "views/auth/SignIn";
import SignUp from "views/auth/SignUp";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Order Tables",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "order-tables",
    component: <DataTables />,
  },
  {
    name: "Inventory",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "inventory",
    component: <Inventory/>,
  },
  {
    name: "Invoice",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "invoice",
    component: <Invoice/>,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "sign-up",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignUp/>,
  },
  
];
export default routes;
