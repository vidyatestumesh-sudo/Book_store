import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ImageIcon from "@mui/icons-material/Image";  // <-- Added for Admin Banner

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-100 font-figtree font-normal leading-snug">
      {/* Mobile overlay */}
      {isMobile && mobileSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setMobileSidebar(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 h-screen bg-gray-800 text-white flex flex-col justify-between py-6 px-3 shadow-lg z-40 transition-all duration-300 ${
          isMobile
            ? mobileSidebar
              ? "w-60 left-0"
              : "w-0 -left-60"
            : isExpanded
            ? "w-60 left-0"
            : "w-20 left-0"
        } overflow-hidden`}
      >
        <div>
          {/* Admin + Toggle */}
          <div
            className={`flex items-center mb-10 ${
              isExpanded && !isMobile
                ? "justify-between px-2"
                : "flex-col space-y-3"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src="/adminprofile.jpg"
                alt="Logo"
                className="w-12 h-12 rounded-full object-cover"
              />
              {(isExpanded && !isMobile) || mobileSidebar ? (
                <span className="text-lg font-playfair font-light text-white leading-tight">
                  Admin
                </span>
              ) : null}
            </div>

            {/* Desktop toggle */}
            {!isMobile && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-300 hover:text-white"
              >
                {isExpanded ? (
                  <ChevronLeftIcon fontSize="small" />
                ) : (
                  <ChevronRightIcon fontSize="small" />
                )}
              </button>
            )}
          </div>

          {/* Nav Links */}
          <nav className="space-y-3">
            <Link
              to="/dashboard"
              className={`no-underline flex items-center ${
                isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
              } py-3 rounded-lg transition-all duration-300 ${
                isActive("/dashboard")
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-600 text-gray-300 hover:text-white"
              }`}
            >
              <DashboardIcon className="w-6 h-6 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && (
                <span className="text-base">Dashboard</span>
              )}
            </Link>

            <Link
              to="/dashboard/manage-books"
              className={`no-underline flex items-center ${
                isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
              } py-3 rounded-lg transition-all duration-300 ${
                isActive("/dashboard/manage-books")
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-600 text-gray-300 hover:text-white"
              }`}
            >
              <MenuBookIcon className="w-6 h-6 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && (
                <span className="text-base">Manage Books</span>
              )}
            </Link>

            <Link
              to="/dashboard/add-blogs"
              className={`no-underline flex items-center ${
                isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
              } py-3 rounded-lg transition-all duration-300 ${
                isActive("/dashboard/add-blogs")
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-600 text-gray-300 hover:text-white"
              }`}
            >
              <LibraryBooksIcon className="w-6 h-6 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && (
                <span className="text-base">Manage Blogs</span>
              )}
            </Link>

            <Link
              to="/dashboard/manage-letters"
              className={`no-underline flex items-center ${
                isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
              } py-3 rounded-lg transition-all duration-300 ${
                isActive("/dashboard/manage-letters")
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-600 text-gray-300 hover:text-white"
              }`}
            >
              <MailOutlineIcon className="w-6 h-6 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && (
                <span className="text-base">Manage Letters</span>
              )}
            </Link>

            {/* Admin Banner Link Added */}
            <Link
              to="/dashboard/admin-banner"
              className={`no-underline flex items-center ${
                isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
              } py-3 rounded-lg transition-all duration-300 ${
                isActive("/dashboard/admin-banner")
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-600 text-gray-300 hover:text-white"
              }`}
            >
              <ImageIcon className="w-6 h-6 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && (
                <span className="text-base">Admin Banner</span>
              )}
            </Link>
          </nav>
        </div>

        {/* Logout */}
        <div
          className={`${
            isExpanded ? "px-4" : "flex justify-center"
          } transition-all duration-300`}
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:text-white hover:bg-red-600 rounded-lg w-full transition-all duration-300 justify-center"
          >
            <LogoutIcon className="w-5 h-5 flex-shrink-0" />
            {(isExpanded || mobileSidebar) && <span className="text-base">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isExpanded && !isMobile ? "ml-60" : !isMobile ? "ml-20" : "ml-0"
        }`}
      >
        {/* Header */}
        <header
          className={`fixed top-0 z-20 flex flex-col items-center justify-center px-6 py-4 bg-white shadow-sm transition-all duration-300 ${
            isExpanded && !isMobile ? "left-60" : !isMobile ? "left-20" : "left-0"
          } right-0`}
        >
          <h1 className="text-2xl md:text-4xl font-playfair font-light text-black leading-tight text-center">
            Dashboard
          </h1>
          <p className="text-sm md:text-base font-figtree text-gray-500 leading-snug text-center">
            Welcome to Langshott Leadership Foundation Admin Panel
          </p>

          {/* Hamburger only on mobile */}
          {isMobile && (
            <button
              onClick={() => setMobileSidebar(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black"
            >
              <MenuIcon fontSize="medium" />
            </button>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 md:px-8 pb-10 pt-[100px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
