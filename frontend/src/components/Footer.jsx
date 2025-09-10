import React from "react";
import { Link } from "react-router-dom";
import footerLogo from "../assets/footer-logo.png";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white py-8 px-4 font-['Poppins']">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Logo & Nav */}
        <div className="md:w-1/2 w-full text-center md:text-left space-y-4">
          <img
            src={footerLogo}
            alt="Logo"
            className="mx-auto md:mx-0 w-28 transition-transform duration-300 hover:scale-105"
          />
          <ul className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
            {[
              { label: "Home", to: "/" },
              { label: "About us", to: "/aboutauthorpage" },
              { label: "Blogs", to: "/blogs" },
              { label: "Contact", to: "/contact" },
            ].map(({ label, to }, idx) => (
              <li key={idx}>
                <Link
                  to={to}
                  className="transition-colors duration-300 hover:text-pink-500"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="md:w-1/2 w-full text-center md:text-right space-y-3">
          <p className="text-sm text-gray-300 leading-snug">
            Subscribe to our website to receive the latest updates and offers!
          </p>
          <div className="flex w-full md:justify-end justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-l-md text-black w-2/3 max-w-xs focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-300 text-sm"
            />
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-r-md text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-300 text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-700 pt-4" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4 text-center md:text-left">
  {/* Left: Terms & Policies */}
  <ul className="flex gap-4">
    <li>
      <Link
        to="/privacy"
        className="hover:text-pink-400 transition-colors duration-300"
      >
        Privacy Policy
      </Link>
    </li>
    <li>
      <Link
        to="/terms"
        className="hover:text-pink-400 transition-colors duration-300"
      >
        Terms of Service
      </Link>
    </li>
  </ul>

  {/* Center: Copyright */}
  <p className="text-gray-100 text-sm mx-4">
    © 2025 Langshott Leadership Foundation. All Rights Reserved. Developed by{" "}
    <a
      href="https://lumos.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-pink-400 underline transition"
    >
    Lumos
    </a>
  </p>

  {/* Right: Social Icons */}
  <div className="flex gap-4">
    <a
      href="https://facebook.com"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-blue-500 transition-transform transform hover:scale-125 duration-300"
    >
      <FaFacebook size={20} />
    </a>
    <a
      href="https://twitter.com"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-sky-400 transition-transform transform hover:scale-125 duration-300"
    >
      <FaTwitter size={20} />
    </a>
    <a
      href="https://instagram.com"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-pink-400 transition-transform transform hover:scale-125 duration-300"
    >
      <FaInstagram size={20} />
    </a>
  </div>
</div>
    </footer>
  );
};

export default Footer;
