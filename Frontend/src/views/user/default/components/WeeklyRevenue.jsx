// import Card from "components/card";
// import BarChart from "components/charts/BarChart";
// import {
//   barChartDataWeeklyRevenue,
//   barChartOptionsWeeklyRevenue,
// } from "variables/charts";
// import { MdBarChart } from "react-icons/md";

// const WeeklyRevenue = ({data}) => {
//   return (
//     <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
//       <div className="mb-auto flex items-center justify-between px-6">
//         <h2 className="text-lg font-bold text-black-700 dark:text-white">
//           Weekly Revenue
//         </h2>
//         <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-black-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
//           <MdBarChart className="h-6 w-6" />
//         </button>
//       </div>

//       <div className="md:mt-16 lg:mt-0">
//         <div className="h-[250px] w-full xl:h-[350px]">
//           <BarChart
//             chartData={}
//             chartOptions={}
//           />
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default WeeklyRevenue;



import React from "react";
import Card from "components/card";
import BarChart from "components/charts/BarChart";
import { MdBarChart } from "react-icons/md";

const WeeklyRevenue = ({ data }) => {
  // Debug: Check data validity
  console.log("Data Received:", data);

  // Fallback for empty or invalid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
        <h2 className="text-lg font-bold text-black-700 dark:text-white">
          No data available to display
        </h2>
      </Card>
    );
  }

  // Transform the data for ApexCharts
  const chartData = [
    {
      name: "Products Sold",
      data: data.map((entry) => entry.quantity || 0),
    },
  ];

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false }, // Hide the toolbar for a cleaner look
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%", // Adjust width for better appearance
        borderRadius: 8, // Rounded bar ends
      },
    },
    colors: ["#34a853", "#a7f3d0"], // Gradient-like effect using two colors
    dataLabels: {
      enabled: false, // Hide data labels for simplicity
    },
    xaxis: {
      categories: data.map((entry) => entry.date), // Dates as x-axis labels
      title: { text: "Date", style: { color: "#888" } },
      labels: { style: { colors: "#555", fontSize: "12px" } }, // Styled axis labels
    },
    yaxis: {
      title: { text: "Number of Products Sold", style: { color: "#888" } },
      labels: { style: { colors: "#555", fontSize: "12px" } },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        gradientToColors: ["#a7f3d0"], // Gradient to a lighter color
        stops: [0, 100],
      },
    },
    grid: {
      borderColor: "#eee",
      strokeDashArray: 4, // Light dashed grid lines
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} Products`,
      },
    },
  };

  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
      <div className="mb-auto flex items-center justify-between px-6">
        <h2 className="text-lg font-bold text-black-700 dark:text-white">
          Weekly Products Sold
        </h2>
        <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-black-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
          <MdBarChart className="h-6 w-6" />
        </button>
      </div>
      <div className="md:mt-16 lg:mt-0">
        <div className="h-[250px] w-full xl:h-[350px]">
          <BarChart chartData={chartData} chartOptions={chartOptions} />
        </div>
      </div>
    </Card>
  );
};

export default WeeklyRevenue;
