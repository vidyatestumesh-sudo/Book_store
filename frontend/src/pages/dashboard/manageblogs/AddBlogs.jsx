import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddBlogs = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: { title: "", description: "", image: "" },
  });

  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState(""); // 🆕 rich text state

  const token = localStorage.getItem("adminToken");

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogs");
      const data = await res.json();
      setBlogs(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Add or update blog
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", description); // 🆕 use ReactQuill state
      if (data.image && data.image[0]) formData.append("image", data.image[0]);

      const url = editingId
        ? `http://localhost:5000/api/blogs/edit/${editingId}`
        : "http://localhost:5000/api/blogs/create-blog";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      let result;
      try {
        result = await res.json();
      } catch {
        result = {};
      }

      if (res.ok) {
        Swal.fire({
          title: editingId ? "Blog Updated" : "Blog Added",
          text: editingId
            ? "Blog updated successfully!"
            : "Blog added successfully!",
          icon: "success",
        });
        reset();
        setDescription(""); // reset editor
        setEditingId(null);
        setShowForm(false);
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

  // Edit blog
  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setValue("title", blog.title);
    setDescription(blog.description); // 🆕 set rich text value
    setShowForm(true);
  };

  // Delete blog
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the blog!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      let result;
      try {
        result = await res.json();
      } catch {
        result = {};
      }

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

  // Read more/less with formatted text
  const BlogDescription = ({ text }) => {
    const [expanded, setExpanded] = useState(false);
    const formattedText = text.replace(/\n/g, "<br />");
    const words = text.split(" ");
    const isLong = words.length > 40;

    return (
      <div className="prose prose-lg text-gray-700 leading-relaxed font-figtree">
        <div
          dangerouslySetInnerHTML={{
            __html:
              expanded || !isLong
                ? formattedText
                : words.slice(0, 40).join(" ") + "...",
          }}
        />
        {isLong && (
          <button
            className="ml-2 inline-flex items-center gap-2 text-[#8c2f24] font-semibold group transition"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Read Less" : "Read More"}
            <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with Add Blog button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">📚 Blogs</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) reset();
            setEditingId(null);
            setDescription(""); // reset description editor
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition transform hover:scale-105"
        >
          {showForm ? "Close Form ✖️" : "➕ Add Blog"}
        </button>
      </div>

      {/* Add/Edit Form (toggle) */}
      {showForm && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl rounded-2xl p-8 mb-10 transition-all duration-500">
          <h2 className="text-2xl font-extrabold mb-6 text-blue-800">
            {editingId ? "✏️ Edit Blog" : "📝 Add New Blog"}
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="space-y-5"
          >
            {/* Title */}
            <div>
              <label className="block font-semibold mb-1 text-gray-800">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter blog title"
                {...register("title", { required: "Title is required" })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description - React Quill */}
            <div>
              <label className="block font-semibold mb-1 text-gray-800">
                Description
              </label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                placeholder="Write your blog content here..."
                className="bg-white rounded"
              />
              {!description && (
                <p className="text-red-500 text-sm mt-1">
                  Description is required
                </p>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="block font-semibold mb-1 text-gray-800">
                Image (optional)
              </label>
              <input
                type="file"
                {...register("image")}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition text-white font-bold py-2 px-6 rounded-lg shadow-lg"
            >
              {isLoading
                ? editingId
                  ? "Updating..."
                  : "Adding..."
                : editingId
                ? "Update Blog"
                : "Add Blog"}
            </button>
          </form>
        </div>
      )}

      {/* Blogs List */}
      <div className="space-y-10">
        {blogs.length ? (
          blogs.map((blog, index) => (
            <div
              key={blog._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 overflow-hidden"
            >
              <div
                className={`flex flex-col md:flex-row ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Blog Image */}
                {blog.image && (
                  <div className="md:w-1/2">
                    <img
                      src={`http://localhost:5000${blog.image}`}
                      alt={blog.title}
                      className="w-full h-60 object-cover md:h-60 transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}

                {/* Blog Content */}
                <div className="md:w-1/2 p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {blog.title}
                    </h3>
                    <BlogDescription text={blog.description} />
                    <p className="text-gray-400 text-xs mt-3">
                      Added: {new Date(blog.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg shadow-md transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default AddBlogs;
