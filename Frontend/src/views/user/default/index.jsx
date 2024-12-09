import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/user/default/components/WeeklyRevenue";
import TotalSpent from "views/user/default/components/TotalSpent";
import PieChartCard from "views/user/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "components/widget/Widget";
import CheckTable from "views/user/default/components/CheckTable";
import ComplexTable from "views/user/default/components/ComplexTable";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import WeeklyRevenueChart from "./components/WeeklyRevenueChart";

const Dashboard = () => {
  const [earnings,setEarning] = useState(0);
  const [userAdmin,setUserAdmin] = useState('admin');
  const [weeklySale,SetWeeklySale] = useState([])
  const [weeklyRevenue,SetWeeklyRevenue] = useState([])
  useEffect(()=>{
    const handleEarnings = async()=>{
      try {
        const response = await axios.get('http://localhost:3000/invoices/earnings/total-earnings');
        // console.log("earnings: " + response);
        if (response.data.success==true){
          setEarning(response.data.earn);
        }
        else{
          setEarning(0);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    const handleAdmin = async()=>{
      try {
        const response = await axios.get('http://localhost:3000/user/admin-details',{
          withCredentials:true
        });
        // console.log("earnings: " + response);
        if (response.data.success==true){
          setUserAdmin(response.data.admin.username);
        }
        else{
          setUserAdmin('admin');
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    const handleWeeklyData =async ()=>{
      try {
        const response = await axios.get('http://localhost:3000/user/daily-salees',{withCredentials:true});
        if(response.data.success==true){
          console.log(response.data.data);
          SetWeeklySale(response.data.data);

        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    const handleMonthlyRevenue = async()=>{
      try {
        const response = await axios.get("http://localhost:3000/user/weekly-revenue",{withCredentials:true});
        if(response.data.success==true){
          SetWeeklyRevenue(response.data.data);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    handleEarnings();
    handleAdmin();
    handleWeeklyData();
    handleMonthlyRevenue();
  },[])
  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Earnings"}
          subtitle={"₹"+earnings}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Out of Stock Products"}
          subtitle={"₹ 900000"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Total Orders"}
          subtitle={"14"}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Admin"}
          subtitle={userAdmin}
        />
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
      <WeeklyRevenueChart data={weeklyRevenue} />
        <WeeklyRevenue data={weeklySale} />
      </div>

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        <div>
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div>

        {/* Traffic chart & Pie Chart */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-1">
          <PieChartCard />
        </div>

        {/* Complex Table , Task & Calendar */}

        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />

        {/* Task chart & Calendar */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-1">
          {/* <TaskCard /> */}
          <div className="grid grid-cols-2  rounded-[20px]">
            <MiniCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

