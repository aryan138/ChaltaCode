import React from "react";

import MainDashboard from "views/user/default";
import Profile from "views/user/profile";
import DataTables from "views/user/tables";
import Inventory from "views/user/inventory";

import SignIn from "views/auth/SignIn";
import SignUp from "views/auth/SignUp";

import {
  MdHome,
  MdBarChart,
  MdOutlineTableChart,
  MdPerson,
  MdDeck,
  MdLock,
} from "react-icons/md";
import InvoiceList from "views/user/invoice/InvoiceList";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/user",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  
  {
    name: "Order Tables",
    layout: "/user",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "order-tables",
    component: <DataTables />,
  },
  {
    name: "Inventory",
    layout: "/user",
    icon: <MdDeck className="h-6 w-6" />,
    path: "inventory",
    component: <Inventory/>,
  },
  {
    name: "Invoice",
    layout: "/user",
    icon: <MdOutlineTableChart className="h-6 w-6" />,
    path: "invoice",
    component: <InvoiceList/>,
  },
  {
    name: "Profile",
    layout: "/user",
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
