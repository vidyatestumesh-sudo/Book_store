import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

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
      <div className="text-center py-10 text-lg font-semibold text-red-500">
        Please log in to view your dashboard.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-blue-50 to-white py-16 font-['Poppins']">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl px-8 py-10">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">
          Hello, {currentUser.displayName || "User"} 👋
        </h1>

        {/* User Info */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            👤 Your Information
          </h2>
          <p>
            <span className="font-bold">Email:</span> {currentUser.email}
          </p>
          {profile && (
            <>
              <p>
                <span className="font-bold">Username:</span> {profile.username}
              </p>
              <p>
                <span className="font-bold">Phone:</span> {profile.phone}
              </p>
              <p>
                <span className="font-bold">Password:</span> ********
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
