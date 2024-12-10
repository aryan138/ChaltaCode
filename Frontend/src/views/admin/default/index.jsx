import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import Table from "../user/components/Table";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import WeeklyRevenueChart from "./components/WeeklyRenevueChart";

const Dashboard = () => {
  const [earnings,setEarning] = useState(0);
  const [totalUsers,setTotalUsers] = useState(0);
  const[ weeklySales,SetWeeklySales] = useState([])
  const [weeklyRevenue,setWeeklyRevenue] = useState([]);
  const [inventorySize,SetInventorySize] = useState({
    totalProduct:0,
    inventorySize:0
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  useEffect(()=>{
    const handleEarning = async()=>{
      try {
        const response = await axios.get('http://localhost:3000/admin/get-earnings',{withCredentials:true});
        // console.log("earnings: " + response);
        if (response.data.success==true){
          // console.log("earnings: " + response.data.earnings)
          setEarning(response.data.earnings);
        }
        else{
          setEarning(0);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    const handleTotalUsers = async()=>{
      try {
        const response = await axios.get('http://localhost:3000/admin/getAllUsers',{withCredentials:true});
        // console.log(response.data);
        if (response.data.success==true){
            setTotalUsers(response.data.users.length);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    const handleWeeklyData =async ()=>{
      try {
        const response = await axios.get('http://localhost:3000/admin/get-daily-sales',{withCredentials:true});
        if(response.data.success==true){
          // console.log(response.data.data);
          SetWeeklySales(response.data.data);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    const handleMonthlyRevenue = async()=>{
      try {
        const response = await axios.get("http://localhost:3000/admin/get-weekly-revenue",{withCredentials:true});
        if(response.data.success==true){
          setWeeklyRevenue(response.data.data);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    const handlePieChart = async()=>{
      try {
        const response1 = await axios.get('http://localhost:3000/superproducts/get-superProduct-stocks',{withCredentials:true});
        const response2 = await axios.get('http://localhost:3000/warehouse/get-details-admin',{withCredentials:true});
        // console.log(response1,response2);
        if (response1.data.success==true && response2.data.success==true){
          // console.log(response1,response2);
          SetInventorySize({totalProduct: Number(response1.data.totalStocks),inventorySize: response2.data.details.storage});
        }else{
          console.log("galat baat");
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    const fetchUsers = async () => {
      try {
        
        const response = await axios.get("http://localhost:3000/admin/getAllUsers", {
          withCredentials: true,
        });
        setUsers(response.data.users); // Set the users state
      } catch (error) {
        setError("Failed to fetch users");
        console.error("Error fetching users:", error);
      }
    };
    
    handleTotalUsers();
    handleEarning();
    handleWeeklyData();
    handleMonthlyRevenue();
    handlePieChart();
    fetchUsers();
  },[])
  const generateDummyData = () => {
    return users.length
      ? users.map((user) => ({
          user_id: user._id,
          name: user.username || "N/A", // Assuming `username` is the correct key for user name
          designation: user.user_designation || "N/A", // Correct key as per the data
          email: user.user_email || "N/A", // Email key matches your response
          phone_number: user.user_mobile_number || "N/A", // Adjust if the key exists in your API
          status: user.user_status || "Active", // Correct key for user status
        }))
      : [];
  };
  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Earnings"}
          subtitle={`₹ ${earnings}`}
        />
        {/* <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Spend this month"}
          subtitle={"₹ 200000"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Sales"}
          subtitle={"₹ 150000"}
        /> */}
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Your Balance"}
          subtitle={"₹ 900000"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"New Tasks"}
          subtitle={"14"}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Total Users"}
          subtitle={totalUsers}
        />
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <WeeklyRevenueChart data={weeklyRevenue}/>
        <WeeklyRevenue data={weeklySales} />
      </div>

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        <div>
        <Table data={generateDummyData()} />
        </div>

        {/* Traffic chart & Pie Chart */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-1">
        <PieChartCard totalProduct={inventorySize.totalProduct} inventorySize={inventorySize.inventorySize} />
        </div> 
      </div>
    </div>
  );
};

export default Dashboard;

