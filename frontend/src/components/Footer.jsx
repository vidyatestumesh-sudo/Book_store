import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-row">
          {/* Left column */}
          <div className="footer-col col-lg-2 col-md-6 col-sm-12 col-12">
            <ul className="footer-links">
              <li>
                <Link to="/contact">CONTACT ME</Link>
              </li>
              <li>
                <Link to="/aboutauthorpage">ABOUT</Link>
              </li>
              <li>
                <Link to="/publications">PUBLICATIONS</Link>
              </li>
            </ul>
          </div>

          {/* Middle column */}
          <div className="footer-col col-lg-4 col-md-6 col-sm-12 col-12">
            <ul className="footer-links">
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

          {/* Right column */}
          <div className="footer-col col-lg-6 col-md-12 col-sm-12 col-12">
            <div className="newsletter">
              <p>Subscribe to Newsletter</p>
              <form
                className="newsletter-form"
                onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email" aria-label="Email" />
                <button type="submit">Subscribe</button>
              </form>
            </div>

            <div className="privacy-social">
              <div className="privacy-links">
                <Link to="/privacy">Privacy Policy</Link>
                <span> | </span>
                <Link to="/disclaimer">Disclaimer</Link>
              </div>
              <div className="social-icons">
                <a href="#" aria-label="Twitter">
                  <FaXTwitter />
                </a>
                <a href="#" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
                <a href="#" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="#" aria-label="Facebook">
                  <FaFacebook />
                </a>
                <a href="#" aria-label="YouTube">
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>
            Copyright © 2025 Langshott Leadership Foundation. All Rights
            Reserved.
          </p>
          <p>
            Powered By:{" "}
            <a
              href="https://lumos.in"
              target="_blank"
              rel="noopener noreferrer">
              LUMOS.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
