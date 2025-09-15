import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const AddBlogs = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: { title: "", description: "", image: "" },
  });

  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

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
      formData.append("description", data.description);
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
        setEditingId(null);
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
    setValue("description", blog.description);
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
      const res = await fetch(`https://bookstore-backend-hshq.onrender.com/api/blogs/${id}`, {
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

  // Read more/less component
  const BlogDescription = ({ text }) => {
    const [expanded, setExpanded] = useState(false);
    const words = text.split(" ");
    const isLong = words.length > 50;

    return (
      <p className="text-gray-700 leading-relaxed">
        {expanded || !isLong ? text : words.slice(0, 50).join(" ") + "..."}
        {isLong && (
          <button
            className="ml-2 text-blue-500 font-medium hover:underline"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Read Less" : "Read More"}
          </button>
        )}
      </p>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Add/Edit Form */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl rounded-2xl p-8 mb-10">
        <h2 className="text-3xl font-extrabold mb-6 text-blue-800">
          {editingId ? "✏️ Edit Blog" : "📝 Add New Blog"}
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="space-y-5"
        >
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

          <div>
            <label className="block font-semibold mb-1 text-gray-800">
              Description
            </label>
            <textarea
              placeholder="Enter blog description"
              {...register("description", { required: "Description is required" })}
              rows={5}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

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

      {/* Blogs List */}
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800">📚 All Blogs</h2>
      <div className="space-y-8">
        {blogs.length ? (
          blogs.map((blog, index) => (
            <div
              key={blog._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden"
            >
              <div
                className={`flex flex-col md:flex-row ${
                  index % 2 === 0
                    ? "md:flex-row"
                    : "md:flex-row-reverse"
                }`}
              >
                {/* Blog Image */}
                {blog.image && (
                  <div className="md:w-1/2">
                    <img
                      src={`https://bookstore-backend-hshq.onrender.com${blog.image}`}
                      alt={blog.title}
                      className="w-full h-72 object-cover md:h-full"
                    />
                  </div>
                )}

                {/* Blog Content */}
                <div className="md:w-1/2 p-6 flex flex-col justify-between">
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
