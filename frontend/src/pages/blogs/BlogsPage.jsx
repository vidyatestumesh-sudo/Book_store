import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarDays } from 'lucide-react';

const BACKEND_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://bookstore-backend-hshq.onrender.com";

// 🔹 Utility: remove quill classes but keep HTML structure
const sanitizeDescription = (html) => {
  return html
    .replace(/class="ql-align-[^"]*"/g, "") // remove ql-align-* classes
    .replace(/style="[^"]*"/g, ""); // remove inline styles if any
};

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);

  // ✅ Fetch blogs from backend
  const fetchBlogs = async () => {
    try {
      const res = await fetch("${BACKEND_BASE_URL}/api/blogs");
      const data = await res.json();
      setBlogs(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-8xl mx-auto py-0 text-center flex flex-col justify-center items-center px-4">
      {/* ✅ Breadcrumb */}
      <div className="breadcrumb-container w-full text-left mb-0 ml-10 font-figtree font-light">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb m-0 p-0 flex gap-2 text-sm">
            <li className="breadcrumb-item">
              <a href="/" className="text-gray-500 hover:underline">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/blogs" className="text-gray-500 hover:underline">Blogs</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/blogs" className="!text-gray-700 hover:underline">Author: Anil Kumar</a>
            </li>
          </ol>
        </nav>
      </div>

      {/* ✅ Title Section */}
      <div className="relative inline-block">
        <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug mb-7 mt-8">
          Author: Anil Kumar
        </h1>
        <img
          src="/motif.webp"
          alt="feather"
          className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2"
        />
      </div>

      {/* ✅ Blogs Section */}
      <div className="max-w-8xl mx-auto px-6 min-h-screen mt-12">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-500 overflow-hidden hover:-translate-y-2 flex flex-col"
              >
                {/* ✅ Blog Image */}
                {blog.image && (
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={`${BACKEND_BASE_URL}${blog.image}`}
                      alt={blog.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}

                {/* ✅ Blog Content */}
                <div className="p-6 text-left flex flex-col flex-grow">
                  <h3 className=" font-semibold text-[18px] sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-[26px] font-Figtree font-regular leading-snug leading-tight mb-3">
                    {blog.title}
                  </h3>

                  {/* ✅ Blog Date */}
                  <p className="flex items-center gap-2 text-gray-400 text-xl mt-3">
                    <CalendarDays className="w-6 h-6" />
                    {new Date(blog.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  {/* ✅ Minimal description preview */}
                  <div
                    className="prose prose-sm text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] xl:text-[21px] text-black-800 font-Figtree font-regular leading-tight lg:leading-[1.3] line-clamp-3 mb-4"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeDescription(
                        blog.description.length > 200
                          ? blog.description.slice(0, 200) + "..."
                          : blog.description
                      ),
                    }}
                  />

                  {/* ✅ Read More Button */}
                  <div className="mt-auto">
                    <Link
                      to={`/blogs/${blog._id}`}
                      className="inline-flex items-center gap-2 text-[#8c2f24] font-semibold group transition"
                    >
                      Read More
                      <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-2">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
