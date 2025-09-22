import { Link } from "react-router-dom";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Menu, MenuItem, IconButton, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import "./Navbar.css";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser, logout } = useAuth();

  // User dropdown
  const [userAnchor, setUserAnchor] = useState(null);
  const isUserOpen = Boolean(userAnchor);

  // Hamburger dropdown (mobile)
  const [hamburgerAnchor, setHamburgerAnchor] = useState(null);
  const isHamburgerOpen = Boolean(hamburgerAnchor);

  // Blogs submenu (desktop)
  const [blogsDesktopAnchor, setBlogsDesktopAnchor] = useState(null);
  const isBlogsDesktopOpen = Boolean(blogsDesktopAnchor);

  const [isBlogsExpanded, setIsBlogsExpanded] = useState(false);

  const hamburgerMenuRef = useRef(null);

  // Handlers: User
  const handleUserClick = (e) => setUserAnchor(e.currentTarget);
  const handleUserClose = () => setUserAnchor(null);

  const handleLogOut = () => {
    logout();
    handleUserClose();
  };

  // Handlers: Hamburger
  const handleHamburgerClick = (e) => setHamburgerAnchor(e.currentTarget);
  const handleHamburgerClose = () => setHamburgerAnchor(null);

  // Handlers: Blogs Desktop
  const handleBlogsDesktopClick = (e) => setBlogsDesktopAnchor(e.currentTarget);
  const handleBlogsDesktopClose = () => setBlogsDesktopAnchor(null);

  // Close all dropdowns
  const closeAllDropdowns = () => {
    handleUserClose();
    handleHamburgerClose();
    handleBlogsDesktopClose();
    setIsBlogsExpanded(false);
  };

  // Click outside or scroll listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        (userAnchor && userAnchor.contains(e.target)) ||
        (hamburgerAnchor && hamburgerAnchor.contains(e.target)) ||
        (hamburgerMenuRef.current &&
          hamburgerMenuRef.current.contains(e.target)) ||
        (blogsDesktopAnchor && blogsDesktopAnchor.contains(e.target))
      )
        return;

      closeAllDropdowns(); // close everything else
    };

    const handleScroll = () => closeAllDropdowns();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [userAnchor, hamburgerAnchor, blogsDesktopAnchor]);

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
              {/* Icons */}
              <div className="navbar-icons">
                {/* User */}
                {currentUser ? (
                  <>
                    <IconButton
                      onClick={handleUserClick}
                      size="small"
                      className="user-avatar">
                      <Avatar className="navbar-avatar">
                        {currentUser.name?.charAt(0).toUpperCase() ||
                          currentUser.email?.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>

                    <Menu
                      anchorEl={userAnchor}
                      open={isUserOpen}
                      onClose={handleUserClose}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      classes={{ paper: "navbar-menu-dropdown" }}>
                      <MenuItem
                        component={Link}
                        to="/user-dashboard"
                        onClick={handleUserClose}
                        className="navbar-menu-item">
                        Profile
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/orders"
                        onClick={handleUserClose}
                        className="navbar-menu-item">
                        My Orders
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/cart"
                        onClick={handleUserClose}
                        className="navbar-menu-item">
                        Cart
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/checkout"
                        onClick={handleUserClose}
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

              {/* Hamburger */}
              <div className="hamburger-wrapper">
                <IconButton
                  className="hamburger-btn"
                  onClick={handleHamburgerClick}
                  aria-label="Toggle menu">
                  {isHamburgerOpen ? (
                    <CloseIcon className="hamburger-icon" />
                  ) : (
                    <MenuIcon className="hamburger-icon" />
                  )}
                </IconButton>

                <Menu
                  ref={hamburgerMenuRef}
                  anchorEl={hamburgerAnchor}
                  open={isHamburgerOpen}
                  onClose={handleHamburgerClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  classes={{ paper: "navbar-menu-dropdown" }}>
                  <MenuItem
                    component={Link}
                    to="/aboutauthorpage"
                    onClick={handleHamburgerClose}
                    className="navbar-menu-item">
                    About
                  </MenuItem>

                  <MenuItem
                    component={Link}
                    to="/publications"
                    onClick={handleHamburgerClose}
                    className="navbar-menu-item">
                    Publications
                  </MenuItem>

                  <MenuItem
                    component={Link}
                    to="/foundation"
                    onClick={handleHamburgerClose}
                    className="navbar-menu-item">
                    The Foundation
                  </MenuItem>

                  {/* Blogs expandable item */}
                  <MenuItem
                    className="navbar-menu-item"
                    onClick={(e) => {
                      e.stopPropagation(); // important: stop document click from firing
                      setIsBlogsExpanded((prev) => !prev);
                    }}>
                    Blogs <ExpandMoreIcon fontSize="small" />
                  </MenuItem>

                  {isBlogsExpanded && (
                    <>
                      <MenuItem
                        component={Link}
                        to="/blogs"
                        onClick={handleHamburgerClose}
                        className="navbar-submenu-item">
                        Blogs
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/inspiration-board"
                        onClick={handleHamburgerClose}
                        className="navbar-submenu-item">
                        Inspiration Board
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/positivity-corner"
                        onClick={handleHamburgerClose}
                        className="navbar-submenu-item">
                        Positivity Corner
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/sufi-corner"
                        onClick={handleHamburgerClose}
                        className="navbar-submenu-item">
                        Sufi Corner
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/events"
                        onClick={handleHamburgerClose}
                        className="navbar-submenu-item">
                        Events
                      </MenuItem>
                    </>
                  )}

                  <MenuItem
                    component={Link}
                    to="/letters"
                    onClick={handleHamburgerClose}
                    className="navbar-menu-item">
                    Letter from Langshott
                  </MenuItem>

                  <MenuItem
                    component={Link}
                    to="/contact"
                    onClick={handleHamburgerClose}
                    className="navbar-menu-item">
                    Contact Me
                  </MenuItem>
                </Menu>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="navbar-desktop-menu">
              <ul className="navbar-menu-desktop">
                <li>
                  <Link to="/aboutauthorpage">ABOUT</Link>
                </li>
                <li>
                  <Link to="/publications">PUBLICATIONS</Link>
                </li>
                <li>
                  <Link to="/foundation">THE FOUNDATION</Link>
                </li>
                <li className="navbar-blogs-menu">
                  <Link
                    to="/blogs"
                    onClick={handleBlogsDesktopClick}
                    className="blogs-link">
                    BLOGS <ExpandMoreIcon fontSize="small" />
                  </Link>
                  <Menu
                    anchorEl={blogsDesktopAnchor}
                    open={isBlogsDesktopOpen}
                    onClose={handleBlogsDesktopClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    classes={{ paper: "navbar-menu-dropdown" }}>
                    <MenuItem
                      component={Link}
                      to="/blogs"
                      onClick={handleBlogsDesktopClose}
                      className="navbar-menu-item">
                      Blogs
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/inspiration-board"
                      onClick={handleBlogsDesktopClose}
                      className="navbar-menu-item">
                      Inspiration Board
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/positivity-corner"
                      onClick={handleBlogsDesktopClose}
                      className="navbar-menu-item">
                      Positivity Corner
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/sufi-corner"
                      onClick={handleBlogsDesktopClose}
                      className="navbar-menu-item">
                      Sufi Corner
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/events"
                      onClick={handleBlogsDesktopClose}
                      className="navbar-menu-item">
                      Events
                    </MenuItem>
                  </Menu>
                </li>
                <li>
                  <Link to="/letters">LETTER FROM LANGSHOTT</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
