import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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
        const res = await fetch(`http://localhost:5000/api/blogs/${id}`);
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

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* ✅ Breadcrumb */}
      <div className="breadcrumb-container w-full text-left mb-6 font-figtree font-light">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb m-0 p-0 flex gap-2 text-sm">
            <li className="breadcrumb-item">
              <Link to="/" className="text-gray-500 hover:underline">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/blogs" className="text-gray-500 hover:underline">Blogs</Link>
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

      {/* ✅ Blog Image */}
      {blog.image && (
        <img
          src={`http://localhost:5000${blog.image}`}
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
