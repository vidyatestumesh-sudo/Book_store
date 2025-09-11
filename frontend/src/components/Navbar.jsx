import { Link } from "react-router-dom";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogOut = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <header className="navbar-header">
      <nav className="container-fluid navbar-container">
        <div className="row align-items-center">
          <div className="col-lg-4 col-md-4 col-sm-4 col-5">
            <Link to="/" className="navbar-logo">
              <img src="/ak-logo.webp" alt="Anil Kumar Logo" />
            </Link>
          </div>

          {/* Right Section */}
          <div className="col-lg-8 col-md-8 col-sm-8 col-7">
            <div className="navbar-icons mb-2">
              {/* User / Login */}
              {currentUser ? (
                <div className="user-dropdown">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="user-avatar">
                    {currentUser.name?.charAt(0) ||
                      currentUser.email?.charAt(0)}
                  </button>
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      <Link
                        to="/user-dashboard"
                        onClick={() => setIsDropdownOpen(false)}>
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsDropdownOpen(false)}>
                        My Orders
                      </Link>
                      <Link to="/cart" onClick={() => setIsDropdownOpen(false)}>
                        Cart
                      </Link>
                      <Link
                        to="/checkout"
                        onClick={() => setIsDropdownOpen(false)}>
                        Checkout
                      </Link>
                      <button onClick={handleLogOut}>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" aria-label="Login">
                  <HiOutlineUser className="icon" />
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="cart-link" aria-label="Cart">
                <HiOutlineShoppingCart className="icon" />
                {cartItems.length > 0 && (
                  <span className="cart-badge">{cartItems.length}</span>
                )}
              </Link>

              {/* Contact */}
              <Link to="/contact" className="contact-link">
                Contact Me
              </Link>
            </div>

            {/* Hamburger toggle (below icons) */}
            <div className="hamburger-wrapper d-lg-none">
              <button
                className="hamburger-btn"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu">
                {menuOpen ? (
                  <HiOutlineX className="hamburger-icon" />
                ) : (
                  <HiOutlineMenu className="hamburger-icon" />
                )}
              </button>
            </div>

            {/* Menu */}
            <div className={`row ${menuOpen ? "menu-open" : ""}`}>
              <div className="col-12">
                <ul className="navbar-menu mt-3 mb-0">
                  <li>
                    <Link to="/aboutauthorpage">ABOUT</Link>
                  </li>
                  <li>
                    <Link to="/publications">PUBLICATIONS</Link>
                  </li>
                  <li>
                    <Link to="/foundation">LANGSHOTT FOUNDATION</Link>
                  </li>
                  <li>
                    <Link to="/blogs">BLOGS</Link>
                  </li>
                  <li>
                    <Link to="/letter">LETTER FROM LANGSHOTT</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
