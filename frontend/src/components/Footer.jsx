import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter"; // for X (Twitter)
import PinterestIcon from "@mui/icons-material/Pinterest";
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
                <Link to="/letters">LETTER FROM LANGSHOTT</Link>
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
                <a
                  href="https://www.instagram.com/langshottleadershipfoundation/"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer">
                  <InstagramIcon />
                </a>
                <a
                  href="https://www.linkedin.com/company/langshott-leadership-foundation/"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer">
                  <LinkedInIcon />
                </a>
                <a
                  href="https://in.pinterest.com/langshottleadershipfoundation/"
                  aria-label="Pinterest"
                  target="_blank"
                  rel="noopener noreferrer">
                  <PinterestIcon />
                </a>
                <a
                  href="https://x.com/LangshottLF"
                  aria-label="Twitter"
                  target="_blank"
                  rel="noopener noreferrer">
                  <TwitterIcon />
                </a>
                <a
                  href="https://www.facebook.com/langshottleadershipfoundation1"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer">
                  <FacebookIcon />
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
