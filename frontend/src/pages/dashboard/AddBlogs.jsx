import React, { useState, useEffect } from "react";
import axios from "axios";

const AddBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", image: null });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("adminToken"); // Admin token

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  useEffect(() => fetchBlogs(), []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    if (form.image) formData.append("image", form.image);

    try {
      if (editingId) {
        // PUT request with token
        await axios.put(
          `http://localhost:5000/api/blogs/${editingId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // POST request with token
        await axios.post(
          "http://localhost:5000/api/blogs",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setForm({ title: "", content: "", image: null });
      setEditingId(null);
      fetchBlogs();
    } catch (err) {
      console.error("Error saving blog:", err);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setForm({ title: blog.title, content: blog.content, image: null });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // Include token
      });
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Blogs</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded p-4 mb-6">
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full border p-2 rounded" required />
        <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          {editingId ? "Update Blog" : "Add Blog"}
        </button>
      </form>

      <div className="grid gap-4">
        {blogs.length ? blogs.map(blog => (
          <div key={blog._id} className="bg-white p-4 shadow rounded flex gap-4">
            {blog.image && <img src={`http://localhost:5000${blog.image}`} alt={blog.title} className="w-32 h-32 object-cover rounded" />}
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="text-gray-600">{blog.content}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => handleEdit(blog)} className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
                <button onClick={() => handleDelete(blog._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            </div>
          </div>
        )) : <p>No blogs found.</p>}
      </div>
    </div>
  );
};

export default AddBlogs;
