import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// MUI icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const BACKEND_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://bookstore-backend-hshq.onrender.com";

const AddBlogs = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: { title: "", description: "", image: null },
  });

  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("adminToken");

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
      const data = await res.json();
      setBlogs(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const onSubmit = async (data) => {
    if (!description) {
      Swal.fire("Error", "Description is required", "error");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", description);

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const url = editingId
        ? `${BACKEND_BASE_URL}/api/blogs/edit/${editingId}`
        : `${BACKEND_BASE_URL}/api/blogs/create-blog`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire(
          editingId ? "Blog Updated" : "Blog Added",
          editingId ? "Blog updated successfully!" : "Blog added successfully!",
          "success"
        );
        reset();
        setDescription("");
        setEditingId(null);
        setViewMode("list");
        fetchBlogs();
      } else {
        Swal.fire("Error", result.message || "Something went wrong", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save blog", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setValue("title", blog.title);
    setDescription(blog.description);
    setViewMode("form");
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the blog!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#2563eb",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      if (res.ok) {
        Swal.fire("Deleted!", "Blog has been deleted.", "success");
        fetchBlogs();
      } else {
        Swal.fire("Error", result.message || "Failed to delete blog", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete blog", "error");
    }
  };

  const BlogCard = ({ blog }) => {
    const [expanded, setExpanded] = useState(false);
    const contentRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState(0);

    const toggleExpand = () => setExpanded(!expanded);
    // Helper: truncate HTML while keeping tags intact
    const truncateHTML = (html, wordLimit = 40) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      let wordCount = 0;

      const traverse = (node) => {
        if (wordCount >= wordLimit) {
          node.remove();
          return;
        }

        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(" ");
          if (wordCount + words.length > wordLimit) {
            node.textContent = words.slice(0, wordLimit - wordCount).join(" ") + "...";
            wordCount = wordLimit;
          } else {
            wordCount += words.length;
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          Array.from(node.childNodes).forEach(traverse);
        }
      };

      Array.from(div.childNodes).forEach(traverse);
      return div.innerHTML;
    };

    useEffect(() => {
      if (contentRef.current) {
        setMaxHeight(expanded ? contentRef.current.scrollHeight : 0);
      }
    }, [expanded, blog.description]);

    const plainText = blog.description.replace(/<[^>]+>/g, "");
    const words = plainText.split(" ");
    const isLong = words.length > 40;

    return (
      <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition duration-500">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/3 bg-gray-100 flex flex-col items-center p-4">
            {blog.image && (
              <div className="w-full h-48 lg:h-64 overflow-hidden rounded-lg">
                <img
                  src={blog.image.startsWith("http") ? blog.image : `${BACKEND_BASE_URL}${blog.image}`}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="lg:w-2/3 p-6 flex flex-col justify-between">
            <h3 className="text-2xl font-semibold mb-2">{blog.title}</h3>
            <p className="flex items-center gap-2 text-gray-500 text-sm mb-3">
              <CalendarTodayIcon fontSize="small" />
              {new Date(blog.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            {isLong ? (
              <>
                <div
                  className="text-gray-700 text-sm leading-relaxed mb-2"
                  dangerouslySetInnerHTML={{ __html: truncateHTML(blog.description, 40) }}
                />
                <button
                  type="button"
                  onClick={toggleExpand}
                  className="text-blue-700 hover:text-blue-900 font-medium mt-2 flex items-center gap-1"
                >
                  {expanded ? "Hide Description" : "Read More"} {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </button>
              </>
            ) : (
              <div
                className="text-gray-700 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />
            )}
            <div className="mt-4 flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => handleEdit(blog)}
                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-md shadow-md transition flex items-center gap-1"
              >
                <EditIcon fontSize="small" /> Edit
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md shadow-md transition flex items-center gap-1"
              >
                <DeleteIcon fontSize="small" /> Delete
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            maxHeight: `${maxHeight}px`,
            overflow: "hidden",
            transition: "max-height 0.5s ease",
          }}
        >
          <div
            ref={contentRef}
            className="p-6 bg-gray-50 border-t border-gray-200 text-gray-700 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-[100px]">
      <div className="container mt-20 mx-auto">
        <div className="max-w-8xl mx-auto p-0 rounded-lg">
          {/* Toggle Buttons */}
          <div className="relative flex justify-center mb-8 bg-gray-200 rounded-full p-1 max-w-md mx-auto shadow-inner">
            {/* Animated sliding background */}
            <div
              className={`absolute top-1 left-1 w-1/2 h-10 bg-blue-600 rounded-full shadow-md transform transition-transform duration-300 ${viewMode === "form" ? "translate-x-full" : ""
                }`}
            ></div>

            {/* Buttons */}
            <button
              className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${viewMode === "list" ? "text-white" : "text-gray-700 hover:text-gray-900 hover:scale-105"
                }`}
              onClick={() => setViewMode("list")}
            >
              <CalendarTodayIcon fontSize="medium" /> View Blogs
            </button>

            <button
              className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${viewMode === "form" ? "text-white" : "text-gray-700 hover:text-gray-900 hover:scale-105"
                }`}
              onClick={() => {
                setViewMode("form");
                reset();
                setEditingId(null);
                setDescription("");
              }}
            >
              <EditIcon fontSize="medium" /> Add Blog
            </button>
          </div>

          {/* Add/Edit Form */}
          {viewMode === "form" && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl rounded-2xl p-8 mb-10 transition-all duration-500">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                {editingId ? "Edit Blog" : "Add New Blog"}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-5">
                <div>
                  <label className="block font-semibold mb-1 text-gray-800">Title</label>
                  <input
                    type="text"
                    placeholder="Enter blog title"
                    {...register("title", { required: "Title is required" })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-gray-800">Description</label>
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    placeholder="Write your blog content here..."
                    className="bg-white rounded"
                  />
                  {!description && <p className="text-red-500 text-sm mt-1">Description is required</p>}
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-gray-800">Image (optional)</label>
                  <input type="file" {...register("image")} className="w-full border rounded-lg px-4 py-2" />
                </div>

                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 transition text-white font-bold py-2 px-6 rounded-lg shadow-lg"
                >
                  {isLoading ? (editingId ? "Updating..." : "Adding...") : editingId ? "Update Blog" : "Add Blog"}
                </button>
              </form>
            </div>
          )}

          {/* Blog List */}
          {viewMode === "list" && (
            <div className="flex flex-col gap-8">
              {blogs.length > 0 ? blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
                : <p className="text-gray-500 text-center py-6">No blogs found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBlogs;
