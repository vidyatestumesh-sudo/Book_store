import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import PinterestIcon from "@mui/icons-material/Pinterest";
import "./Footer.css";

import book1 from "../assets/books/the-attributes-of-a-virtuous-mindset.webp";
import book2 from "../assets/books/master-the-rules-of-manifestation.webp";
import post1 from "../assets/books/footer-post1.webp";
import post2 from "../assets/books/footer-post2.webp";
import post3 from "../assets/books/footer-post3.webp";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* Column 1 - Links + Social */}
          <div className="col-lg-3 col-md-6 col-sm-6 col-12 footer-section1">
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
              <li>
                <Link to="/foundation">THE FOUNDATION</Link>
              </li>
              <li>
                <Link to="/blogs">BLOGS</Link>
              </li>
              <li>
                <Link to="/letters">LETTER FROM LANGSHOTT</Link>
              </li>
            </ul>

            <div className="privacy-links">
              <Link to="/privacy">Privacy Policy</Link>
              <span> | </span>
              <Link to="/disclaimer">Disclaimer</Link>
            </div>

            <div className="social-icons">
              <a
                href="https://x.com/LangshottLF"
                target="_blank"
                rel="noreferrer">
                <TwitterIcon />
              </a>
              <a
                href="https://www.linkedin.com/company/langshott-leadership-foundation/"
                target="_blank"
                rel="noreferrer">
                <LinkedInIcon />
              </a>
              <a
                href="https://www.instagram.com/langshottleadershipfoundation/"
                target="_blank"
                rel="noreferrer">
                <InstagramIcon />
              </a>
              <a
                href="https://www.facebook.com/langshottleadershipfoundation1"
                target="_blank"
                rel="noreferrer">
                <FacebookIcon />
              </a>
              <a
                href="https://in.pinterest.com/langshottleadershipfoundation/"
                target="_blank"
                rel="noreferrer">
                <PinterestIcon />
              </a>
            </div>
          </div>

          {/* Column 2 - Featured Books */}
          <div className="col-lg-3 col-md-6 col-sm-6 col-12 footer-section2">
            <h4 className="footer-heading">Featured Books</h4>
              <div className="featured-book">
              <img src={book1} alt="The Attributes of A Virtuous Mindset" />
              <div>
                <p>The Attributes of A Virtuous Mindset</p>
                <span>
                  <span style={{ color: "#983120" }}>₹ </span>200
                </span>
              </div>
            </div>
            <div className="featured-book">
              <img src={book2} alt="Master the Rules of Manifestation" />
              <div>
                <p>Master the Rules of Manifestation</p>
                <span>
                  <span style={{ color: "#983120" }}>₹ </span>300
                </span>
              </div>
            </div>
          </div>

          {/* Column 3 - Newsletter + Popular Posts */}
          <div className="col-lg-6 col-md-12 col-sm-12 col-12 footer-section3">
            <div className="newsletter">
              <p>Subscribe to Newsletter</p>
              <form
                className="newsletter-form"
                onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email" aria-label="Email" />
                <button type="submit">Subscribe</button>
              </form>
            </div>

            <h4 className="footer-heading footer-posts">Popular Posts</h4>
            <div className="popular-posts">
              <div className="post">
                <img src={post1} alt="On Hiding Emptiness" />
                <div className="overlay">
                  <p>On Hiding Emptiness</p>
                  <span>September 8, 2025</span>
                </div>
              </div>
              <div className="post">
                <img src={post2} alt="The Chains Within" />
                <div className="overlay">
                  <p>The Chains Within</p>
                  <span>July 17, 2025</span>
                </div>
              </div>
              <div className="post">
                <img src={post3} alt="Nothing truly ends where it begins" />
                <div className="overlay">
                  <p>Nothing truly ends where it begins</p>
                  <span>June 9, 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
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
