import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import { getImgUrl } from "../../utils/getImgUrl";
import { CalendarDays } from "lucide-react";

const AboutAuthorPage = () => {
  // Backend URL (set according to your environment)
  const BACKEND_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://bookstore-backend-hshq.onrender.com";

  // Fetch Books
  const { data: books = [] } = useFetchAllBooksQuery();
  const activeBooks = books.filter((book) => !book.suspended);

  // Fetch Blogs
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/blogs`)
      .then((res) => res.json())
      .then((data) => {
        setBlogs(
          data
            .filter((b) => !b.suspended)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      })
      .catch(console.error);
  }, [BACKEND_BASE_URL]);

  return (
    <div className="container">
      <div className="max-w-8xl mx-auto py-0 text-center flex flex-col justify-center items-center px-4 mb-20">
        <div className="breadcrumb-container w-full text-left mb-0 font-figtree font-lite">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb m-0 p-0">
              <li className="breadcrumb-item">
                <a href="/" className="text-gray">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/aboutauthorpage" className="!text-gray-600">About Author</a>
              </li>
            </ol>
          </nav>
        </div>

        <section className="flex flex-col lg:flex-row items-center">
          {/* Left Image Section */}
          <div className="flex justify-center lg:justify-start flex-shrink-0 w-full lg:w-1/2 mt-5">
            <img
              src="/ak-i.webp"
              alt="Author"
              className="w-full max-w-[500px] lg:max-w-[550px] object-contain rounded-lg select-none transition duration-300"
            />
          </div>

          {/* Right Text Section */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2">
            {/* Title Section */}
            <div className="relative inline-block">
              <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug mb-4 mt-4">
                Anil Kumar
              </h1>
              <img
                src="/motif.webp"
                alt="feather"
                className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2"
              />
            </div>
            <div className="text-left mt-4">
              <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-gray-800 font-Figtree leading-relaxed mb-4">
                This is me in the given picture. You and I are one.
              </p>
              <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-gray-800 font-Figtree leading-relaxed mb-4">
                At a very young age Anil Kumar sensed conflict, physical, social, and psychological,
                both inside and around him, and discovered a secret ally which he calls Nature that
                has always given him the strength to withstand adversity and courage…
              </p>
              <span className="text-[17px] sm:text-[22px] md:text-[24px] lg:text-[25px] xl:text-[25px] font-Figtree font-regular leading-snug leading-tight italic lg:leading-[1.3]">
                “The solutions you’re searching for are within you, we can only help you to get there”
              </span>
            </div>
          </div>
        </section>

        {/* Blogs Section */}
        <section className="mt-4">
          <div className="relative inline-block">
            <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug mb-4 mt-4">
              Recent Blogs by Anil Kumar
            </h1>
            <img
              src="/motif.webp"
              alt="feather"
              className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2"
            />
          </div>
          {/* Blogs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-5 max-w-8xl mx-auto">
            {blogs.slice(0, 4).map((blog) => (
              <Link
                key={blog._id}
                to={`/blogs/${blog._id}`}
                className="relative group w-full h-full sm:h-50  overflow-hidden rounded-xl duration-500 cursor-pointer"
              >
                {/* Blog Image */}
                {blog.image && (
                  <img
                    src={blog.image.startsWith("http") ? blog.image : `${BACKEND_BASE_URL}${blog.image}`}
                    alt={blog.title}
                    className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}

                {/* Hover Overlay */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 z-10"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.6)";
                    Array.from(e.currentTarget.children).forEach((child) => (child.style.opacity = "1"));
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0,0,0,0)";
                    Array.from(e.currentTarget.children).forEach((child) => (child.style.opacity = "0"));
                  }}
                >
                  {/* Title Row */}
                  <span
                    className="!text-white !text-lg !font-semibold hover:!text-[#cc6633] !cursor-pointer mb-2 text-center px-2"
                    style={{ opacity: 0, transition: "opacity 0.5s ease" }}
                  >
                    {blog.title}
                  </span>

                  {/* Date Row */}
                  <span
                    className="text-gray-300 text-sm"
                    style={{ opacity: 0, transition: "opacity 0.5s ease" }}
                  >
                    {new Date(blog.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {/* Explore Blogs Button */}
          <div className="mt-14 flex justify-center">
            <Link
              to="/blogs"
              className="px-3 py-2 no-underline rounded-full bg-[#983120] text-base hover:bg-[#7a241b] text-white font-medium text-base transition-all duration-300"
            >
              Explore more Blogs
            </Link>
          </div>
        </section>

        {/* Recent Books Section */}
        <section className="mt-5 sm:mt-4">
          <div className="relative inline-block">
            <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug mb-4 mt-4">
              Recent Books by Anil Kumar
            </h1>
            <img
              src="/motif.webp"
              alt="feather"
              className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2"
            />
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-3 max-w-8xl mx-auto">
            {activeBooks.slice(0, 4).map((book) => (
              <div
                key={book._id}
                className="rv-card relative group w-full cursor-pointer rounded-xl duration-500"
              >
                <Link to={`/books/${book._id}`} className="flex flex-col items-center">
                  {/* Book Image */}
                  <div className="w-full">
                    <img
                      src={getImgUrl(book?.coverImage)}
                      alt={book.title}
                      className="w-[70%] mx-auto mt-6 object-cover transition-transform duration-500"
                    />
                  </div>

                  {/* Book Title & Pricing */}
                  <h4 className="mt-0 font-Figtree-Regular text-[20px] text-center">{book.title}</h4>
                  <p className="text-[20px] mt-0 text-center">
                    <span className="old-price">₹ {book.oldPrice}</span>
                    <span className="current-price">₹ {book.newPrice}</span>
                    {book.oldPrice > book.newPrice && (
                      <span className="discount">
                        {Math.round(((book.oldPrice - book.newPrice) / book.oldPrice) * 100)}% off
                      </span>
                    )}
                  </p>
                </Link>
              </div>
            ))}
          </div>
          {/* Explore Books Button */}
          <div className="mt-10 xl:mb-4 flex justify-center">
            <Link
              to="/publications"
              className="px-3 py-2 no-underline rounded-full bg-[#983120] text-white font-medium text-base hover:bg-[#7a241b] hover:shadow-lg transition-all duration-300"
            >
              Explore more Books
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutAuthorPage;
