
// import React, { useState, useEffect } from "react";
// import ComplexTable from "./components/ComplexTable";
// import { columnsDataComplex } from "./variables/columnsData";
// import axios from "axios";
// import Card from "components/card";
// import { MdFileUpload } from "react-icons/md";
// import AddOrder from "./components/AddOrder";

// const Tables = () => {
//   const [tableData, setTableData] = useState([]);

//   useEffect(() => {
//     // const token = Cookies.get('accessToken');
//     // console.log(token);
//     const fetchTableData = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/order/getorder",{withCredentials: true});
//         // console.log(response);

//         if (response.data.status === 200) {
//           const result = response.data.data; 
//           // Access the 'data' field directly
//           console.log(result);

//           const formattedData = result.map((order) => ({
//             order_id: order.order_id,
//             item_name: order.product_name,
//             date: new Date(order.createdAt).toLocaleDateString("en-US", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric",
//             }),
//             status: order.status,
//             item_quantity: order.product_quantity,
//           }));
//           // console.log(formattedData);
//           setTableData(formattedData);
//         } else {
//           console.error("Failed to fetch data:", response.data.message);
//         }
//       } catch (error) {
//         alert("Error fetching data:", error);
//       }
//     };

//     fetchTableData();
//   }, []); // Empty dependency array means this useEffect runs once when the component mounts

//   return (
//     <div>
//       <div className="mt-5 w-2/4">
//       <Card className="grid h-full w-full grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-4 font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none 2xl:grid-cols-11 ">
//       <div className="col-span-5 h-full w-full rounded-xl bg-lightPrimary dark:!bg-navy-700 2xl:col-span-6">
//         <button className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-3 dark:!border-navy-700 lg:pb-0">
//           <MdFileUpload className="text-[80px] text-brand-500 dark:text-white" />
//           <h4 className="text-xl font-bold text-brand-500 dark:text-white">
//             Order Now
//           </h4>
//           <p className="mt-2 text-sm font-medium text-gray-600">
//             Order products from super inventory
//           </p>
//         </button>
//       </div>

//       <div className="col-span-5 flex h-full w-full flex-col justify-center overflow-hidden rounded-xl bg-white pl-3 pb-4 dark:!bg-navy-800">
//         <h5 className="text-left text-xl font-bold leading-9 text-navy-700 dark:text-white">
//           Order Products from here
//         </h5>
//         <p className="leading-1 mt-2 text-base font-normal text-gray-600">
//           You can Order Products from your admin's super inventory through this order 
//         </p>
//         <button
//           href=" "
//           className="linear mt-4 flex items-center justify-center rounded-xl bg-brand-500 px-2 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
//         >
//           Click here to Order
//         </button>
//       </div>
//     </Card>
//       </div>
//       <div className="mt-5">

//         <ComplexTable
//           columnsData={columnsDataComplex}
//           tableData={tableData}
//         />
//       </div>
//     </div>
//   );
// };

// export default Tables;

import React, { useState, useEffect } from "react";
import ComplexTable from "./components/ComplexTable";
import { columnsDataComplex } from "./variables/columnsData";
import axios from "axios";
import Card from "components/card";
import { MdFileUpload } from "react-icons/md";
import AddOrder from "./components/AddOrder";

const Tables = () => {
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/order/getorder", {
          withCredentials: true,
        });

        if (response.data.status === 200) {
          const result = response.data.data;
          const formattedData = result.map((order) => ({
            order_id: order.order_id,
            item_name: order.product_name,
            date: new Date(order.createdAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            status: order.status,
            item_quantity: order.product_quantity,
          }));
          setTableData(formattedData);
        } else {
          console.error("Failed to fetch data:", response.data.message);
        }
      } catch (error) {
        alert("Error fetching data:", error);
      }
    };

    fetchTableData();
  }, []);

  const handleOrderClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="mt-5 w-2/4">
        <Card className="grid h-full w-full grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-4 font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none 2xl:grid-cols-11">
          <div className="col-span-5 h-full w-full rounded-xl bg-lightPrimary dark:!bg-navy-700 2xl:col-span-6 overflow-y-auto">
            <button
              className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-3 dark:!border-navy-700 lg:pb-0"
              onClick={handleOrderClick}
            >
              <MdFileUpload className="text-[80px] text-brand-500 dark:text-white" />
              <h4 className="text-xl font-bold text-brand-500 dark:text-white">
                Order Now
              </h4>
              <p className="mt-2 text-sm font-medium text-gray-600">
                Order products from super inventory
              </p>
            </button>
          </div>

          <div className="col-span-5 flex h-full w-full flex-col justify-center overflow-hidden rounded-xl bg-white pl-3 pb-4 dark:!bg-navy-800">
            <h5 className="text-left text-xl font-bold leading-9 text-navy-700 dark:text-white">
              Order Products from here
            </h5>
            <p className="leading-1 mt-2 text-base font-normal text-gray-600">
              You can order products from your admin's super inventory through this order.
            </p>
            <button
              className="linear mt-4 flex items-center justify-center rounded-xl bg-brand-500 px-2 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
              onClick={handleOrderClick}
            >
              Click here to Order
            </button>
          </div>
        </Card>
      </div>

      <div className="mt-5">
        <ComplexTable columnsData={columnsDataComplex} tableData={tableData} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white rounded-lg shadow-lg p-6 w-2/5 h-2/4">
            <AddOrder onClose={handleModalClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;


