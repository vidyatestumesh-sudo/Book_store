import { Link } from "react-router-dom";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogOut = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-[#fdfdfd] font-['Poppins'] border-b border-gray-200">
      <nav className="max-w-screen-2xl mx-auto px-8 py-4">
        {/* Top Row: Logo + Right Icons */}
        <div className="flex items-center justify-between">
          {/* Left: Logo text */}
          <Link
            to="/"
          >
            {/* Logo */}
            <div className="mb-6">
              <img
                src="/ak-logo.webp"
                alt="Langshott Leadership Foundation"
                className="h-10 md:h-14"
              />
            </div>
          </Link>

          {/* Right: Icons */}
          <div className="flex items-center space-x-6 relative">
            {/* Login / User */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-9 h-9 flex items-center justify-center bg-[#8c6239] text-white rounded-full font-semibold uppercase"
                >
                  {currentUser.name?.charAt(0) || currentUser.email?.charAt(0)}
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md py-2 z-50">
                    <Link
                      to="/user-dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link to="/cart" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}>
                      Cart </Link>

                    <Link to="/checkout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}>
                      Checkout </Link>
                    <button
                      onClick={handleLogOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" aria-label="Login">
                <HiOutlineUser className="text-2xl text-gray-700 hover:text-[#8c6239]" />
              </Link>
            )}

            {/* Cart → show only if logged in */}
            {currentUser && (
              <Link
                to="/cart"
                className="relative flex items-center text-gray-700 hover:text-[#8c6239]"
                aria-label="Cart"
              >
                <HiOutlineShoppingCart className="text-2xl" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#8c2f2f] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}

            {/* Contact Me */}
            <Link
              to="/contact"
              className="text-sm text-gray-700 hover:text-[#8c6239]"
            >
              Contact Me
            </Link>
          </div>
        </div>

        {/* Second Row: Menu links aligned right */}
        <div className="mt-3 flex justify-end">
          <ul className="flex space-x-10 text-[15px] font-medium text-gray-800">
            <li>
              <Link to="/aboutauthorpage" className="hover:text-[#8c6239]">
                ABOUT
              </Link>
            </li>
            <li>
              <Link to="/publications" className="hover:text-[#8c6239]">
                PUBLICATIONS
              </Link>
            </li>
            <li>
              <Link to="/foundation" className="hover:text-[#8c6239]">
                LANGSHOTT FOUNDATION
              </Link>
            </li>
            <li>
              <Link to="/blogs" className="hover:text-[#8c6239]">
                BLOGS
              </Link>
            </li>
            <li>
              <Link to="/letter" className="hover:text-[#8c6239]">
                LETTER FROM LANGSHOTT
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
