import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// Define the backend base URL based on hostname
const BACKEND_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://bookstore-backend-hshq.onrender.com";

// 🔹 Utility: remove quill classes but keep HTML structure
const sanitizeDescription = (html) => {
  return html
    .replace(/class="ql-align-[^"]*"/g, "")
    .replace(/style="[^"]*"/g, "");
};

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/blogs/${id}`);
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error("Failed to fetch blog", err);
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) {
    return <p className="text-center mt-10">Loading blog...</p>;
  }

  // Determine correct image URL
  const imageUrl =
    blog.image && blog.image.startsWith("http")
      ? blog.image // full URL (Cloudinary)
      : blog.image
      ? `${BACKEND_BASE_URL}${blog.image.startsWith("/") ? "" : "/"}${blog.image}` // local upload
      : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* ✅ Breadcrumb */}
      <div className="breadcrumb-container w-full text-left mb-6 font-figtree font-light">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb m-0 p-0 flex gap-2 text-sm">
            <li className="breadcrumb-item">
              <Link to="/" className="text-gray-500 hover:underline">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/blogs" className="text-gray-500 hover:underline">
                Blogs
              </Link>
            </li>
            <li className="breadcrumb-item">
              <span className="!text-gray-700"> {blog.title} </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* ✅ Title */}
      <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug mb-6">
        {blog.title}
      </h1>

      {blog.image && (
  <img
    src={
      blog.image.startsWith("http")
        ? blog.image
        : `${BACKEND_BASE_URL}${blog.image}`
    }
    alt={blog.title}
    className="w-full rounded-2xl shadow-lg mb-8 object-cover max-h-[500px]"
  />
)}
      {/* ✅ Full Description */}
      <div
        className="prose max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: sanitizeDescription(blog.description) }}
      />

      {/* ✅ Blog Date */}
      <p className="text-gray-400 text-xs mt-6">
        Added: {new Date(blog.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default BlogDetailPage;
