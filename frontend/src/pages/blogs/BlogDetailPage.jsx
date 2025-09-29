import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarDays, ArrowRight, ArrowLeft } from "lucide-react";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import { getImgUrl } from "../../utils/getImgUrl";

const BACKEND_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://bookstore-backend-hshq.onrender.com";

const sanitizeDescription = (html) => {
  return html
    .replace(/class="ql-align-[^"]*"/g, "")
    .replace(/style="[^"]*"/g, "");
};

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const { data: books = [] } = useFetchAllBooksQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 3; // Blogs per page in Latest Blogs

  // Only active books
  const activeBooks = books.filter((book) => !book.suspended);

  useEffect(() => {
    if (books.length === 0) return;
    const interval = setInterval(() => handleNext(), 4000);
    return () => clearInterval(interval);
  }, [books]);

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? activeBooks.length - 1 : prev - 1));
      setFade(true);
    }, 300);
  };

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBooks.length);
      setFade(true);
    }, 300);
  };

  useEffect(() => {
    const fetchBlog = async () => {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/blogs/${id}`);
    const data = await res.json();

    // ✅ Make sure it's a blog and not suspended
    if (data.suspended || data.type !== "blogs") {
      setBlog(null);
    } else {
      setBlog(data);
    }
  } catch (err) {
    console.error("Failed to fetch blog", err);
  }
};

const fetchLatestBlogs = async () => {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
    const data = await res.json();

    // ✅ Filter only blogs and exclude suspended ones
    const sorted = data
      .filter(
        (b) => b._id !== id && !b.suspended && b.type === "blogs"
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setLatestBlogs(sorted);
  } catch (err) {
    console.error("Failed to fetch latest blogs", err);
  }
};


    fetchBlog();
    fetchLatestBlogs();
  }, [id]);

  if (!blog) return <p className="text-center mt-10">Blog not found.</p>;

  // Pagination for Latest Blogs
  const totalPages = Math.ceil(latestBlogs.length / blogsPerPage);
  const indexOfLast = currentPage * blogsPerPage;
  const indexOfFirst = indexOfLast - blogsPerPage;
  const currentBlogs = latestBlogs.slice(indexOfFirst, indexOfLast);

  return (
    <div className="container">
      <div className="max-w-8xl mx-auto py-0 text-center flex flex-col justify-center items-center px-4">

        {/* Banner */}
        <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-[10px] z-0">
          <img
            src={blog.image?.startsWith("http") ? blog.image : `${BACKEND_BASE_URL}${blog.image}`}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-black/40 z-0" />

          <div className="relative z-10 flex flex-col justify-center items-center text-center text-white h-full px-2">
            {/* Breadcrumb */}
            <div className="absolute top-4 left-4 z-20">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 p-0 flex gap-0 text-[14px]">
                  <li className="breadcrumb-item"><a href="/" className="text-gray-300 hover:underline">Home</a></li>
                  <li className="breadcrumb-item"><a href="/blogs" className="text-gray-300 hover:underline">Blogs</a></li>
                  <li className="breadcrumb-item text-gray-200 truncate max-w-[120px]" title={blog.title}>{blog.title}</li>
                </ol>
              </nav>
            </div>

            <div className="relative w-full max-w-[900px] mx-auto text-center px-3 sm:px-6 md:px-8 lg:px-0">
              <h1 className="relative text-[30px] sm:text-[34px] md:text-[50px] font-playfair font-light leading-snug">
                {blog.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="max-w-8xl mx-auto px-0 py-6 grid gap-10 lg:grid-cols-1 xl:grid-cols-4">
          <div className="col-span-1 xl:col-span-3">
            <p className="flex items-center gap-2 text-gray-400 text-md font-regular mt-0 mb-2">
              <CalendarDays className="w-5 h-5" />
              {new Date(blog.createdAt).toLocaleDateString(undefined, {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>

            <div
              className="text-left max-w-none text-gray-800 text-[15px] sm:text-[17px] md:text-[17px] lg:text-[18px] xl:text-[18px] font-Figtree leading-snug whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: sanitizeDescription(blog.description) }}
            />
          </div>

          {/* Sidebar - Featured Books */}
          {window.innerWidth >= 1280 && (
            <aside className="col-span-1">
              <div className="bg-[#f3e7db] border-1 border-gray-500 rounded-[6px] p-4 max-h-[700px] min-h-[540px] flex flex-col">
                <h3 className="text-[20px] sm:text-[24px] md:text-[28px] font-Figtree font-medium text-gray-900 font-[400] mb-4">
                  Featured Books
                </h3>

                {activeBooks.length > 0 && (
                  <div className="flex flex-col items-center text-center rounded-lg overflow-hidden relative flex-grow">
                    <div key={activeBooks[currentIndex]?._id} className={`flex flex-col items-center absolute transition-all duration-700 ease-in-out transform will-change-transform ${fade ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
                      <Link to={`/books/${activeBooks[currentIndex]?._id}`} className="no-underline">
                        <img
                          src={getImgUrl(activeBooks[currentIndex]?.coverImage)}
                          alt={activeBooks[currentIndex]?.title}
                          className="w-40 h-58 object-cover mb-4 cursor-pointer hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <Link to={`/books/${activeBooks[currentIndex]?._id}`} className="no-underline">
                        <h4 className="text-[16px] sm:text-[18px] md:text-[20px] text-black font-Figtree mb-3 hover:text-[#993333] transition-colors duration-300 cursor-pointer">
                          {activeBooks[currentIndex]?.title}
                        </h4>
                      </Link>
                    </div>

                    <div className="flex items-center justify-center gap-6 mt-auto relative z-10">
                      <button onClick={handlePrev} className="w-8 h-8 flex items-center justify-center border border-black rounded-full group hover:bg-gray-100">
                        <ArrowLeft size={20} strokeWidth={2} className="text-black transition-colors duration-300 group-hover:text-red-500" />
                      </button>
                      <button onClick={handleNext} className="w-8 h-8 flex items-center justify-center border border-black rounded-full group hover:bg-gray-100">
                        <ArrowRight size={20} strokeWidth={2} className="text-black transition-colors duration-300 group-hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>

        {/* Latest Blogs */}
        <div className="max-w-8xl mx-auto py-0">
          <div className="relative inline-block">
            <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug mb-4 mt-4">
              Latest Blogs
            </h1>
            <img
              src="/motif.webp"
              alt="feather"
              className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-1"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10 gap-10">
            {currentBlogs.map((blog) => (
              <div
                key={blog._id}
                className="group bg-white rounded-[10px] border-[2px] hover:shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition duration-500 overflow-hidden hover:-translate-y-2 flex flex-col"
              >
                {blog.image && (
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={blog.image.startsWith("http") ? blog.image : `${BACKEND_BASE_URL}${blog.image}`}
                      alt={blog.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}

                <div className="p-4 text-left flex flex-col flex-grow">
                  <p className="text-[18px] sm:text-[20px] md:text-[20px] lg:text-[22px] xl:text-[22px] font-Figtree font-medium leading-snug">
                    {blog.title}
                  </p>
                  <p className="flex items-center gap-2 text-gray-400 text-lg mt-3 mb-2">
                    <CalendarDays className="w-5 h-5" />
                    {new Date(blog.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div
                    className="text-[15px] sm:text-[17px] md:text-[17px] lg:text-[18px] xl:text-[18px] text-black-800 font-Figtree font-regular leading-snug mt-0 mb-2 px-1 sm:px-1"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeDescription(
                        blog.description.length > 160
                          ? blog.description.slice(0, 160) + "..."
                          : blog.description
                      ),
                    }}
                  />
                  <div className="mt-auto">
                    <Link
                      to={`/blogs/${blog._id}`}
                      className="flex items-center gap-2 mx-auto font-figtree text-[16px] sm:text-[18px] transition group no-underline"
                    >
                      <span className="inline-flex text-[#993333] items-center gap-1 text-[16px] sm:text-[18px] font-regular no-underline">
                        Read More
                      </span>
                      <span className="text-[#993333] transform transition-transform duration-200 group-hover:translate-x-[5px]">
                        <ArrowRight size={20} strokeWidth={2} />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-3 mt-10 mb-20">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center border border-black rounded-full disabled:opacity-30"
            >
              <ArrowLeft size={20} strokeWidth={2} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-8 h-8 flex items-center justify-center rounded-full ${currentPage === num
                  ? "bg-[#993333] text-white"
                  : "border-transparent text-black hover:border-black"
                  }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-black rounded-full disabled:opacity-30"
            >
              <ArrowRight size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
