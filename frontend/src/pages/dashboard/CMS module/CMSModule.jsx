import React from "react";
import { Link, useLocation } from "react-router-dom";
import ImageIcon from "@mui/icons-material/Image";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookIcon from "@mui/icons-material/Book";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person"; // Added icon for Author

const CMSModule = () => {
  const location = useLocation();

  const modules = [
    { name: "Home - Banner", icon: <ImageIcon className="w-10 h-10 text-purple-600" />, route: "/dashboard/admin-banner" },
    { name: "Home - Reader Thoughts", icon: <DescriptionIcon className="w-10 h-10 text-green-600" />, route: "/dashboard/reader-thoughts" },
    { name: "Home - corners", icon: <BookIcon className="w-10 h-10 text-pink-600" />, route: "/dashboard/admin-corners" },
      { name: "Home - Reviews", icon: <DescriptionIcon className="w-10 h-10 text-indigo-600" />, route: "/dashboard/manage-reviews" },

    { name: "Manage Blogs", icon: <LibraryBooksIcon className="w-10 h-10 text-blue-600" />, route: "/dashboard/add-blogs" },
    { name: "Manage Books", icon: <MenuBookIcon className="w-10 h-10 text-yellow-600" />, route: "/dashboard/manage-books" },
    { name: "Manage Letters", icon: <MailOutlineIcon className="w-10 h-10 text-red-600" />, route: "/dashboard/manage-letters" },
    { name: "Author Content", icon: <PersonIcon className="w-10 h-10 text-teal-600" />, route: "/dashboard/edit-author" },
    { name: "Sufi corners", icon: <PersonIcon className="w-10 h-10 text-teal-600" />, route: "/dashboard/admin-sufi-corner" },
    { name: "manage-inspiration", icon: <PersonIcon className="w-10 h-10 text-teal-600" />, route: "/dashboard/manage-inspiration" },
  ];

  const isCardActive = (route) => location.pathname === route;

  return (
    <div className="container mt-[100px]">
      <div className="max-w-8xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          CMS Module
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {modules.map((module, index) => (
            <Link
              to={module.route}
              key={index}
              className={`relative p-6 rounded-xl flex flex-col items-center justify-center gap-4 text-center transition-transform duration-300 transform 
                shadow-lg bg-white hover:scale-105 hover:shadow-2xl no-underline
                ${isCardActive(module.route)
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-2xl"
                  : "text-gray-800"
                }
              `}
            >
              {/* Icon with background circle */}
              <div className={`p-4 rounded-full transition-colors duration-300
                ${isCardActive(module.route) ? "bg-white/20" : "bg-gray-100 hover:bg-gray-200"}
              `}>
                {module.icon}
              </div>

              {/* Module Name */}
              <h3 className="text-lg font-semibold transition-colors duration-300">
                {module.name}
              </h3>

              {/* Hover underline effect */}
              <span className={`block w-12 h-1 mt-2 rounded-full transition-all duration-300
                ${isCardActive(module.route) ? "bg-white" : "bg-purple-500 group-hover:w-16"}
              `}></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CMSModule;
