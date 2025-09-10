import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#e5dfd7] text-[#333] py-10 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Left Column */}
        <div className="space-y-2">
          <Link to="/contact" className="block hover:underline">Contact Me</Link>
          <Link to="/aboutauthorpage" className="block hover:underline">About</Link>
          <Link to="/publications" className="block hover:underline">Publications</Link>
        </div>

        {/* Middle Column */}
        <div className="space-y-2">
          <Link to="/foundation" className="block hover:underline">Langshott Foundation</Link>
          <Link to="/blogs" className="block hover:underline">Blogs</Link>
          <Link to="/letter" className="block hover:underline">Letter from Langshott</Link>
        </div>

        {/* Right Column: Newsletter */}
        <div className="space-y-3 text-center md:text-right">
          <p className="text-sm text-gray-700">
            Subscribe to our website to receive the latest updates and offers!
          </p>
          <div className="flex justify-center md:justify-end">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-l-md text-black w-2/3 max-w-xs focus:outline-none border border-gray-400 text-sm"
            />
            <button className="bg-[#333] text-white px-4 py-2 rounded-r-md hover:bg-black text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-400 my-6" />

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 text-center md:text-left gap-4">
        {/* Left */}
        <div className="flex flex-wrap gap-4">
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link to="/disclaimer" className="hover:underline">Disclaimer</Link>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-gray-600">
          <a href="#" className="hover:text-black" aria-label="LinkedIn">
            <FaLinkedin size={18} />
          </a>
          <a href="#" className="hover:text-black" aria-label="Instagram">
            <FaInstagram size={18} />
          </a>
          <a href="#" className="hover:text-black" aria-label="Facebook">
            <FaFacebook size={18} />
          </a>
          <a href="#" className="hover:text-black" aria-label="YouTube">
            <FaYoutube size={18} />
          </a>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="bg-[#ccc7c2] text-center text-xs text-gray-800 mt-6 py-3">
        <p>
          Copyright © 2025 Langshott Leadership Foundation. All Rights Reserved.
        </p>
        <p>
          Powered By:{" "}
          <a
            href="https://lumos.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-black"
          >
            LUMOS.in
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
