import React from "react";
import banner from "assets/img/profile/banner.png";
import Card from "components/card";
import { useAdmin } from "useContext/adminContext";

const Banner = () => {
  const adminInfo = useAdmin();
  return (
    <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
      {/* Background and profile */}
      <div
        className="relative mt-1 flex h-24 w-full justify-center rounded-xl bg-cover"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-black-700">
          <img className="h-full w-full rounded-full" src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="" />
        </div>
      </div>

      {/* Name and position */}
      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-xl font-bold text-black-700 dark:text-white">
          {adminInfo.admin_name || "Admin Name"}
        </h4>
        <p className="text-base font-normal text-gray-600">Admin Name</p>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <h4 className="text-xl font-bold text-black-700 dark:text-white">
          {adminInfo.admin_email || "Email"}
        </h4>
        <p className="text-base font-normal text-gray-600">Email</p>
      </div>

      {/* Post followers  md:!gap-32 */}
      <div className="mt-6 mb-3 flex gap-40 md:!gap-32">
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg font-bold text-black-700 dark:text-white">{adminInfo.admin_plan_type || "Plan Type"}</p>
          <p className="text-sm font-normal text-gray-600">Plan Type</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg font-bold text-black-700 dark:text-white">
          {adminInfo.admin_mobile_number || "Mobile Number"}
          </p>
          <p className="text-sm font-normal text-gray-600">Mobile Number</p>
        </div>
      </div>
      <div className="mt-6 mb-3 flex gap-40 md:!gap-32">
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg font-bold text-black-700 dark:text-white">{adminInfo.company_name || "FDAF"}</p>
          <p className="text-sm font-normal text-gray-600">Company Name</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg font-bold text-black-700 dark:text-white">
          {adminInfo.company_industry || "Company Industry"}
          </p>
          <p className="text-sm font-normal text-gray-600">Company Industry</p>
        </div>
      </div>


      <div className="mt-4 flex flex-col items-center">
        <h4 className="text-lg font-bold text-black-700 dark:text-white">
          {adminInfo.company_address || "Company Address"}
        </h4>
        <p className="text-base font-normal text-gray-600">Company Address</p>
      </div>

      {/* <div className="mt-4 grid grid-cols-2 gap-28 text-center">
        <div className="flex flex-col items-center">
          <p className="text-lg font-bold text-gray-800 dark:text-white">{adminInfo.admin_plan_type || "Plan Type"}</p>
          <p className="text-sm text-gray-600">Plan Type</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-lg font-bold text-gray-800 dark:text-white">
            {adminInfo.admin_mobile_number || "Mobile Number"}
          </p>
          <p className="text-sm text-gray-600">Mobile Number</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-28 text-center">
        <div className="flex flex-col items-center">
          <p className="text-lg font-bold text-gray-800 dark:text-white">{adminInfo.company_name || "Company Name"}</p>
          <p className="text-sm text-gray-600">Company Name</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-lg font-bold text-gray-800 dark:text-white">
            {adminInfo.company_industry || "Company Industry"}
          </p>
          <p className="text-sm text-gray-600">Company Industry</p>
        </div>
      </div> */}
    </Card>
  );
};

export default Banner;
