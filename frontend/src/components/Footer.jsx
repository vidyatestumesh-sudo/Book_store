import { Link } from "react-router-dom";
import { useFetchAllBooksQuery } from "../redux/features/books/booksApi";
import { getImgUrl } from "../utils/getImgUrl";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import PinterestIcon from "@mui/icons-material/Pinterest";
import "./Footer.css";
import { useEffect, useState } from "react";

const BACKEND_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://bookstore-backend-hshq.onrender.com";

const Footer = () => {
  // Books API
  const { data: books = [] } = useFetchAllBooksQuery();
  const recentBooks = [...books].slice(-2).reverse();

  // Blogs State
  const [blogs, setBlogs] = useState([]);

  // Fetch Blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
        const data = await res.json();
        const recent = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setBlogs(recent);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      }
    };
    fetchBlogs();
  }, []);

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
            {recentBooks.length > 0 ? (
              recentBooks.map((book, index) => (
                <div className="featured-book" key={index}>
                  <img src={getImgUrl(book?.coverImage)} alt={book?.title} />
                  <div>
                    <p>{book?.title}</p>
                    <span>
                      <span style={{ color: "#983120" }}>₹ </span>
                      {book?.newPrice}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No featured books available</p>
            )}
          </div>

          {/* Column 3 - Newsletter + Recent Blogs */}
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

            <h4 className="footer-heading footer-posts">Recent Blogs</h4>
            <div className="popular-posts">
              {blogs.length > 0 ? (
                blogs.map((blog, index) => (
                  <div className="post" key={index}>
                    <img
                      src={
                        blog.image?.startsWith("http")
                          ? blog.image
                          : `${BACKEND_BASE_URL}${blog.image}`
                      }
                      alt={blog.title}
                    />
                    <div className="overlay">
                      <p>{blog.title}</p>
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No recent blogs available</p>
              )}
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
