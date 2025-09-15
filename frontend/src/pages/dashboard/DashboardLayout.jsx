import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { HiViewGridAdd } from 'react-icons/hi';
import { MdOutlineManageHistory } from 'react-icons/md';
import { FaSignOutAlt } from 'react-icons/fa';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Helper function to determine active route
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-20 sm:w-60 bg-gray-800 text-white flex flex-col justify-between py-6 px-3 shadow-lg">
        <div>
          <Link className="flex items-center justify-center sm:justify-start space-x-2 px-3 mb-10">
            <img src="/adminprofile.jpg" alt="Logo" className="w-10 h-10 rounded-full" />
            <span className="hidden sm:inline text-xl font-bold">Admin</span>
          </Link>

          <nav className="space-y-4">
            <Link
              to="/dashboard"
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${isActive('/dashboard')
                ? 'bg-purple-600 text-white'
                : 'hover:bg-purple-600 text-gray-300 hover:text-white'
                }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"
                />
              </svg>
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <Link
              to="/dashboard/add-new-book"
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${isActive('/dashboard/add-new-book')
                ? 'bg-purple-600 text-white'
                : 'hover:bg-purple-600 text-gray-300 hover:text-white'
                }`}
            >
              <HiViewGridAdd className="w-6 h-6" />
              <span className="hidden sm:inline">Add Book</span>
            </Link>

            <Link
              to="/dashboard/manage-books"
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${isActive('/dashboard/manage-books')
                ? 'bg-purple-600 text-white'
                : 'hover:bg-purple-600 text-gray-300 hover:text-white'
                }`}
            >
              <MdOutlineManageHistory className="w-6 h-6" />
              <span className="hidden sm:inline">Manage Books</span>
            </Link>

            {/* Blogs */}
            <Link
              to="/dashboard/add-blogs"
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${isActive('/dashboard/blogs')
                  ? 'bg-purple-600 text-white'
                  : 'hover:bg-purple-600 text-gray-300 hover:text-white'
                }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h9l7 7v9a2 2 0 01-2 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-8H7v8" />
              </svg>
              <span className="hidden sm:inline">Add Blogs</span>
            </Link>

            {/* Letter from Langshott */}
            <Link
              to="/dashboard/manage-letters"
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${isActive('/dashboard/manage-letters')
                ? 'bg-purple-600 text-white'
                : 'hover:bg-purple-600 text-gray-300 hover:text-white'
                }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="hidden sm:inline">Manage Langshott Letters</span>
            </Link>
          </nav>

        </div>

        {/* Logout */}
        <div className="px-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:text-white hover:bg-red-600 rounded-lg w-full transition-all duration-300"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex flex-col items-center justify-center px-6 py-6 bg-white shadow-sm text-center">
          <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome to the Book Store Admin Panel</p>
        </header>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 px-6 py-4">
          <Link
            to="/dashboard/manage-books"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded hover:bg-purple-100 transition-all duration-300"
          >
            <MdOutlineManageHistory className="mr-2" />
            Manage Books
          </Link>
          <Link
            to="/dashboard/add-new-book"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded transition-all duration-300"
          >
            <HiViewGridAdd className="mr-2" />
            Add Book
          </Link>
        </div>

        {/* Page Content */}
        <main className="flex-1 px-6 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
