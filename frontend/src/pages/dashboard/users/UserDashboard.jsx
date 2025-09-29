import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const { currentUser, getUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser?.uid) {
        const data = await getUserProfile(currentUser.uid);
        setProfile(data);
      }
    };
    fetchProfile();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex justify-center items-center text-center px-4">
        <p className="text-lg sm:text-xl text-red-500 font-semibold">
          Please log in to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="max-w-8xl mx-auto flex flex-col items-center px-2 py-0 font-['Poppins']">
        {/* Title Section */}
        <div className="relative inline-block text-center mt-5 mb-6 w-full">
          <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-snug">
            Your Dashboard
          </h1>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto opacity-15 mb-0"
          />
        </div>

        {/* Dashboard Card */}
        <div className="bg-white rounded-xl border border-[#C76F3B] shadow-sm w-full mt-10 md:w-2/3 lg:w-1/2 p-2 flex flex-col gap-6">
          {/* Greeting */}
          {/* Greeting */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair text-[#C76F3B] font-semibold text-center">
            Hello, {currentUser.displayName || "User"}
          </h2>
          {/* User Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2">
              Your Information
            </h3>
            <p className="text-base sm:text-lg text-gray-700">
              <span className="font-semibold">Email:</span> {currentUser.email}
            </p>
            {profile && (
              <>
                <p className="text-base sm:text-lg text-gray-700">
                  <span className="font-semibold">Username:</span> {profile.username}
                </p>
                <p className="text-base sm:text-lg text-gray-700">
                  <span className="font-semibold">Phone:</span> {profile.phone}
                </p>
                <p className="text-base sm:text-lg text-gray-700">
                  <span className="font-semibold">Password:</span> ********
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
