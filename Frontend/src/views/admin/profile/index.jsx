// import { useState,useEffect } from "react";
// import Banner from "./components/Banner";
// import General from "./components/General";
// import Notification from "./components/Notification";
// import Project from "./components/Project";
// import Storage from "./components/Storage";
// import Upload from "./components/Upload";
// import axios from "axios";
// import { useUser } from "useContext/userContext";


// const ProfileOverview = () => {
//   // const [userInfo,setUserInfo] = useState({});
//   const userInfo = useUser();
//   return (
//     <div className="flex w-full flex-col gap-5">
//       <div className="w-ful mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
//         <div className="col-span-4 lg:!mb-0">
//           <Banner />
//         </div>

//         {/* <div className="col-span-3 lg:!mb-0">
//           <Storage />
//         </div> */}

//         <div className="z-0 col-span-8 lg:!mb-0">
//           <Upload />
//         </div>
//       </div>
//       {/* all project & ... */}

//       <div className="grid h-full grid-cols-1 gap-5 lg:!grid-cols-12">
//         <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-4">
//           <Project />
//         </div>
//         <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-5">
//           <General />
//         </div>

//         <div className="col-span-5 lg:col-span-12 lg:mb-0 3xl:!col-span-3">
//           <Notification />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileOverview;
import { useState, useEffect } from "react";
import Banner from "./components/Banner";
import General from "./components/General";
import Notification from "./components/Notification";
import Project from "./components/Project";
import Storage from "./components/Storage";
import Upload from "./components/Upload";
import ProfileUpdate from "./components/ProfileUpdate"; // Import the ProfileUpdate component
import axios from "axios";
import { useUser } from "useContext/userContext";

const ProfileOverview = () => {
  const [isProfileUpdateOpen, setIsProfileUpdateOpen] = useState(false); // State to control the popup visibility
  const userInfo = useUser();

  const handleProfileUpdateClick = () => {
    setIsProfileUpdateOpen(true);
  };

  const handleProfileUpdateClose = () => {
    setIsProfileUpdateOpen(false);
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="w-full mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="col-span-4 lg:!mb-0">
          <Banner />
        </div>

        <div className="z-0 col-span-8 lg:!mb-0">
          <Upload onClick={handleProfileUpdateClick} /> {/* Pass the click handler */}
        </div>
      </div>

      <div className="grid h-full grid-cols-1 gap-5 lg:!grid-cols-12">
        <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-4">
          <Project />
        </div>
        <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-5">
          <General />
        </div>

        <div className="col-span-5 lg:col-span-12 lg:mb-0 3xl:!col-span-3">
          <Notification />
        </div>
      </div>

      {isProfileUpdateOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <ProfileUpdate onClose={handleProfileUpdateClose} /> {/* Profile update form popup */}
    </div>
  </div>
)}
    </div>
  );
};

export default ProfileOverview;
