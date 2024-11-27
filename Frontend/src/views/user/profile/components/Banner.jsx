// import React from "react";
// import banner from "assets/img/profile/banner.png";
// import Card from "components/card";
// import { useUser } from "useContext/userContext";

// const Banner = () => {
//   const userInfo = useUser();
//   return (
//     <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
//       {/* Background and profile */}
//       <div
//         className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
//         style={{ backgroundImage: `url(${banner})` }}
//       >
//         <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-black-700">
//           <img className="h-full w-full rounded-full" src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="" />
//         </div>
//       </div>

//       {/* Name and position */}
//       <div className="mt-16 flex flex-col items-center">
//         <h4 className="text-xl font-bold text-black-700 dark:text-white">
//           {userInfo.user_username}
//         </h4>
//         <p className="text-base font-normal text-gray-600">{userInfo.user_designation}</p>
//       </div>

//       {/* Post followers */}
//       <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
//         <div className="flex flex-col items-center justify-center">
//           <p className="text-lg font-bold text-black-700 dark:text-white">17</p>
//           <p className="text-sm font-normal text-gray-600">Users</p>
//         </div>
//         <div className="flex flex-col items-center justify-center">
//           <p className="text-lg font-bold text-black-700 dark:text-white">
//             20
//           </p>
//           <p className="text-sm font-normal text-gray-600">Branches</p>
//         </div>
//         <div className="flex flex-col items-center justify-center">
//           <p className="text-lg font-bold text-black-700 dark:text-white">
//             {userInfo.user_username}
//           </p>
//           <p className="text-sm font-normal text-gray-600">Employee Id</p>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default Banner;




import React from "react";
import banner from "assets/img/profile/banner.png";
import Card from "components/card";
import { useUser } from "useContext/userContext";

const Banner = () => {
  const userInfo = useUser();

  return (
    <Card extra={"w-full h-full p-6 bg-cover rounded-lg shadow-lg"}>
      {/* Background and Profile */}
      <div
        className="relative flex h-24 w-full justify-center rounded-lg bg-cover"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute -bottom-10 flex h-[100px] w-[100px] items-center justify-center rounded-full border-4 border-white bg-blue-400 shadow-lg">
          <img
            className="h-full w-full rounded-full"
            src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
            alt="Profile"
          />
        </div>
      </div>

      {/* User Information */}
      {/* <div className="mt-14 text-center">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
          {userInfo.user_username || "Username"}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Username
        </p>
      </div> */}
      <div className="mt-14 text-center">
        <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
          {userInfo.user_email || "Username"}
        </h5>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {/* {userInfo.user_designation || "Designation"} */}
          email
        </p>
      </div>

      {/* Stats Section */}
      <div className="mt-4 grid grid-cols-2 gap-6 text-center">
        <div className="flex flex-col items-center">
          <p className="text-lg font-bold text-gray-800 dark:text-white">{userInfo.user_fullname || "Name"}</p>
          <p className="text-sm text-gray-500">Name</p>
        </div>
        {/* <div className="flex flex-col items-center">
          <p className="text-xl font-bold text-gray-800 dark:text-white">20</p>
          <p className="text-sm text-gray-500">Branches</p>
        </div> */}
        <div className="flex flex-col items-center">
          <p className="text-lg font-bold text-gray-800 dark:text-white">
            {userInfo.user_phone_number || "Emp ID"}
          </p>
          <p className="text-sm text-gray-500">Phone Number</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-6 text-center">
        <div className="flex flex-col items-center">
          <p className="text-lg font-bold text-gray-800 dark:text-white">{userInfo.user_company_name || "Company Name"}</p>
          <p className="text-sm text-gray-500">Company Name</p>
        </div>
        {/* <div className="flex flex-col items-center">
          <p className="text-xl font-bold text-gray-800 dark:text-white">20</p>
          <p className="text-sm text-gray-500">Branches</p>
        </div> */}
        <div className="flex flex-col items-center">
          <p className="text-lg font-bold text-gray-800 dark:text-white">
            {userInfo.user_designation || "Designation"}
          </p>
          <p className="text-sm text-gray-500">Designation</p>
        </div>
      </div>
      {/* <div className="mt-4 grid grid-cols-2 gap-6 text-center"> */}
        <div className="flex flex-col items-center mt-4">
          <p className="text-lg font-bold text-gray-800 dark:text-white">{userInfo.user_admin_name || "Admin Name"}</p>
          <p className="text-sm text-gray-500">Admin Name</p>
        </div>
        {/*<div className="flex flex-col items-center">
          <p className="text-lg font-bold text-gray-800 dark:text-white">
            {userInfo.user_designation || "Designation"}
          </p>
          <p className="text-sm text-gray-500">Designation</p>
        </div> */}
      {/* </div> */}
    </Card>
  );
};

export default Banner;