import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";

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
    handleTotalUsers();
    handleEarning();
    handleWeeklyData();
    handleMonthlyRevenue();
    handlePieChart();
  },[])
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
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div>

        {/* Traffic chart & Pie Chart */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-1">
        <PieChartCard totalProduct={inventorySize.totalProduct} inventorySize={inventorySize.inventorySize} />
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

