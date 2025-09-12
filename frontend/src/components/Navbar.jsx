import { Link } from "react-router-dom";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Menu, MenuItem, IconButton, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import "./Navbar.css";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    logout();
    handleMenuClose();
  };

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event) => {
      const target = event.target;
      if (menuRef.current && menuRef.current.contains(target)) return;
      if (hamburgerRef.current && hamburgerRef.current.contains(target)) return;
      setMenuOpen(false);
    };

    const onScroll = () => setMenuOpen(false);

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [menuOpen]);

  return (
    <header className="navbar-header">
      <nav className="container-fluid navbar-container">
        <div className="row">
          {/* Logo */}
          <div className="col-lg-4 col-md-4 col-sm-4 col-5">
            <Link to="/" className="navbar-logo">
              <img src="/ak-logo.webp" alt="Anil Kumar Logo" />
            </Link>
          </div>

          {/* Right Section */}
          <div className="col-lg-8 col-md-8 col-sm-8 col-7">
            <div className="navbar-right-wrapper">
              {/* Icons + Hamburger (flex row on mobile) */}
              <div className="navbar-icons">
                {/* User / Login */}
                {currentUser ? (
                  <>
                    <IconButton
                      onClick={handleAvatarClick}
                      size="small"
                      className="user-avatar">
                      <Avatar className="navbar-avatar">
                        {currentUser.name?.charAt(0).toUpperCase() ||
                          currentUser.email?.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>

                    <Menu
                      anchorEl={anchorEl}
                      open={isMenuOpen}
                      onClose={handleMenuClose}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
                      classes={{ paper: "navbar-menu-dropdown" }}>
                      <MenuItem
                        component={Link}
                        to="/user-dashboard"
                        onClick={handleMenuClose}
                        className="navbar-menu-item">
                        Profile
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/orders"
                        onClick={handleMenuClose}
                        className="navbar-menu-item">
                        My Orders
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/cart"
                        onClick={handleMenuClose}
                        className="navbar-menu-item">
                        Cart
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/checkout"
                        onClick={handleMenuClose}
                        className="navbar-menu-item">
                        Checkout
                      </MenuItem>
                      <MenuItem
                        onClick={handleLogOut}
                        className="navbar-menu-item">
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Link to="/login" aria-label="Login">
                    <PersonOutlineIcon className="icon" />
                  </Link>
                )}

                {/* Cart */}
                <Link to="/cart" className="cart-link" aria-label="Cart">
                  <ShoppingCartOutlinedIcon className="icon" />
                  {cartItems.length > 0 && (
                    <span className="cart-badge">{cartItems.length}</span>
                  )}
                </Link>

                {/* Contact (desktop only) */}
                <Link to="/contact" className="contact-link">
                  Contact Me
                </Link>
              </div>

              {/* Hamburger toggle (mobile) */}
              <div className="hamburger-wrapper">
                {/* 
                  onPointerDown stops the pointer event from bubbling to document
                  so the document listener won't treat this click as an "outside" click.
                */}
                <button
                  ref={hamburgerRef}
                  className="hamburger-btn"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Toggle menu">
                  {menuOpen ? (
                    <CloseIcon className="hamburger-icon" />
                  ) : (
                    <MenuIcon className="hamburger-icon" />
                  )}
                </button>
              </div>
            </div>

            {/* Desktop Menu (above 991px) */}
            <div className="navbar-desktop-menu">
              <ul className="navbar-menu-desktop">
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
      </nav>

      {/* Mobile Hamburger Menu */}
      <div
        ref={menuRef}
        className={`navbar-mobile-menu ${menuOpen ? "menu-open" : ""}`}>
        <ul className="navbar-menu">
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
          {/* Contact (mobile only) */}
          <li className="contact-mobile">
            <Link to="/contact">CONTACT ME</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
