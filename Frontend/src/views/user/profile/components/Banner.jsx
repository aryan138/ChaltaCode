import React from "react";
import banner from "assets/img/profile/banner.png";
import Card from "components/card";
import { useUser } from "useContext/userContext";

const Banner = () => {
  const userInfo = useUser();
  return (
    <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
      {/* Background and profile */}
      <div
        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
          <img className="h-full w-full rounded-full" src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="" />
        </div>
      </div>

      {/* Name and position */}
      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {userInfo.user_username}
        </h4>
        <p className="text-base font-normal text-gray-600">{userInfo.user_designation}</p>
      </div>

      {/* Post followers */}
      <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg font-bold text-navy-700 dark:text-white">17</p>
          <p className="text-sm font-normal text-gray-600">Users</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg font-bold text-navy-700 dark:text-white">
            20
          </p>
          <p className="text-sm font-normal text-gray-600">Branches</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg font-bold text-navy-700 dark:text-white">
            {userInfo.user_username}
          </p>
          <p className="text-sm font-normal text-gray-600">Employee Id</p>
        </div>
      </div>
    </Card>
  );
};

export default Banner;
