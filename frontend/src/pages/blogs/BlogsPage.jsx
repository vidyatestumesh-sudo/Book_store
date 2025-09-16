import React, { useState, useEffect } from "react";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [expandedBlogId, setExpandedBlogId] = useState(null);

  const handleToggle = (id) => {
    setExpandedBlogId(expandedBlogId === id ? null : id);
  };

  // ✅ Fetch blogs from backend
  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogs");
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
              <a href="/blogs" className="!text-gray-700 hover:underline">
                Blogs
              </a>
            </li>
          </ol>
        </nav>
      </div>

      {/* ✅ Title Section */}
      <div className="relative inline-block">
        <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair text-black font-display leading-snug mb-7 mt-8">
          Latest Blogs
        </h1>
        <img
          src="/motif.webp"
          alt="feather"
          className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-14 sm:w-16 md:w-20 lg:w-24 h-auto [opacity:0.15] mb-4"
        />
      </div>

      {/* ✅ Blogs Section */}
      <div className="max-w-8xl mx-auto px-6 min-h-screen mt-8">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs found.</p>
        ) : (
          <div className="space-y-12">
            {blogs.map((blog, index) => (
              <div
                key={blog._id}
                className={`group flex flex-col md:flex-row items-center bg-white rounded-3xl shadow-xl hover:shadow-2xl transition duration-500 overflow-hidden hover:-translate-y-2 ${
                  index % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* ✅ Blog Image */}
                {blog.image && (
                  <div className="w-full md:w-1/2 relative h-64 md:h-80 overflow-hidden">
                    <img
                      src={`http://localhost:5000${blog.image}`}
                      alt={blog.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}

                {/* ✅ Blog Content */}
                <div className="w-full md:w-1/2 p-8 space-y-4 text-gray-800 text-left">
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    {blog.title}
                  </h3>

                  {/* ✅ Rich text with line breaks + same look as AddBlogs */}
                  <div className="prose prose-lg text-gray-700 leading-relaxed font-figtree transition-all duration-500 ease-in-out max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          expandedBlogId === blog._id
                            ? blog.description.replace(/\n/g, "<br/>")
                            : blog.description
                                .split(" ")
                                .slice(0, 40)
                                .join(" ") + "...",
                      }}
                    />
                  </div>

                  {/* ✅ Read More Button */}
                  <button
                    onClick={() => handleToggle(blog._id)}
                    className="mt-2 inline-flex items-center gap-2 text-[#8c2f24] font-semibold group transition"
                  >
                    {expandedBlogId === blog._id ? "Read Less" : "Read More"}
                    <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-2">
                      →
                    </span>
                  </button>

                  {/* ✅ Blog Date */}
                  <p className="text-gray-400 text-xs mt-3">
                    Added: {new Date(blog.createdAt).toLocaleString()}
                  </p>
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
