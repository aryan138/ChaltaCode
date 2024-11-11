
import { useState, useEffect } from "react";
import Banner from "./components/Banner";
import General from "./components/General";
import Notification from "./components/Notification";
import Project from "./components/Project";
import Storage from "./components/Storage";
import Upload from "./components/Upload";
import ProfileUpdate from "./components/ProfileUpdate";
import axios from "axios";
import { useUser } from "useContext/userContext";

const ProfileOverview = () => {
  const [isProfileUpdateOpen, setIsProfileUpdateOpen] = useState(false);
  const userInfo = useUser();

  const handleProfileUpdateClick = () => {
    setIsProfileUpdateOpen(true);
  };

  const handleProfileUpdateClose = () => {
    setIsProfileUpdateOpen(false);
  };

  // Close popup when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleProfileUpdateClose();
    }
  };

  return (
    <div 
      className={`
        flex w-full flex-col gap-5 
        transition-all duration-300 ease-in-out 
        ${isProfileUpdateOpen 
          ? 'relative overflow-hidden' 
          : ''
        }
      `}
    >
      {/* Blur overlay when popup is open */}
      {isProfileUpdateOpen && (
        <div 
          className="fixed inset-0 bg-white/70 backdrop-blur-xs z-40 pointer-events-none"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 40,
            pointerEvents: 'none'
          }}
        />
      )}

      <div className="w-full mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="col-span-4 lg:!mb-0">
          <Banner />
        </div>

        <div className="z-0 col-span-8 lg:!mb-0">
          <Upload onClick={handleProfileUpdateClick} />
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
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="w-full max-w-xl mx-auto">
            <ProfileUpdate onClose={handleProfileUpdateClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileOverview;