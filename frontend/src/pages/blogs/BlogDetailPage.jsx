import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";

const BACKEND_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://bookstore-backend-hshq.onrender.com";

// 🔹 Clean description HTML
const sanitizeDescription = (html) => {
  return html
    .replace(/class="ql-align-[^"]*"/g, "")
    .replace(/style="[^"]*"/g, "");
};

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [latestBlogs, setLatestBlogs] = useState([]);

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

    const fetchLatestBlogs = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
        const data = await res.json();
        // Sort + pick latest 3 excluding current
        const sorted = data
          .filter((b) => b._id !== id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setLatestBlogs(sorted);
      } catch (err) {
        console.error("Failed to fetch latest blogs", err);
      }
    };

    fetchBlog();
    fetchLatestBlogs();
  }, [id]);

  if (!blog) {
    return <p className="text-center mt-10">Loading blog...</p>;
  }

  return (
    <div className="w-full">
      {/* ✅ Banner Section */}
      <div className="relative w-full h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden">
        <img
          src={
            blog.image?.startsWith("http")
              ? blog.image
              : `${BACKEND_BASE_URL}${blog.image}`
          }
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center text-white h-full px-4">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="flex gap-2 text-sm justify-center">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <span>/</span>
              <li>
                <Link to="/blogs" className="hover:underline">
                  Blogs
                </Link>
              </li>
              <span>/</span>
              <li className="text-gray-200">{blog.title}</li>
            </ol>
          </nav>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-light leading-snug mb-4">
            {blog.title}
          </h1>

          {/* Date */}
          <p className="flex items-center gap-2 text-gray-200 text-sm md:text-base">
            <CalendarDays className="w-5 h-5" />
            {new Date(blog.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* ✅ Blog Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 text-left">
        <div
          className="prose max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizeDescription(blog.description) }}
        />
      </div>

      {/* ✅ Latest Blogs Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-playfair font-light text-center mb-10">
          Latest Blogs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestBlogs.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-xl border hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              {b.image && (
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={
                      b.image.startsWith("http")
                        ? b.image
                        : `${BACKEND_BASE_URL}${b.image}`
                    }
                    alt={b.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg md:text-xl font-Figtree font-medium leading-snug mb-2">
                  {b.title}
                </h3>
                <p className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(b.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-600 text-sm flex-grow">
                  {b.description.length > 120
                    ? b.description.slice(0, 120) + "..."
                    : b.description}
                </p>
                <Link
                  to={`/blogs/${b._id}`}
                  className="mt-4 inline-flex items-center gap-1 text-black hover:underline"
                >
                  Read More <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
