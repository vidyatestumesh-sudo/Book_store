import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

const AddBlogs = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      title: '',
      description: '',
      image: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("adminToken"); // your admin token

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/blogs');
      const data = await res.json();
      const sortedBlogs = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBlogs(sortedBlogs);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.description);
      if (data.image[0]) formData.append('image', data.image[0]);

      let url = 'http://localhost:5000/api/blogs';
      let method = 'POST';

      if (editingId) {
        url += `/${editingId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire({
          title: editingId ? 'Blog updated' : 'Blog added',
          text: editingId ? 'Your blog has been updated!' : 'Your blog has been added!',
          icon: 'success',
          confirmButtonColor: '#3085d6'
        });
        reset();
        setEditingId(null);
        fetchBlogs();
      } else {
        Swal.fire('Error', result.message || 'Something went wrong', 'error');
      }

    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to save blog. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setValue('title', blog.title);
    setValue('description', blog.content);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the blog!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (res.ok) {
          Swal.fire('Deleted!', 'Blog has been deleted.', 'success');
          fetchBlogs();
        } else {
          Swal.fire('Error', result.message || 'Failed to delete blog', 'error');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete blog', 'error');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Add/Edit Blog Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Blog' : 'Add New Blog'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter blog title"
              {...register('title', { required: 'Title is required' })}
              className="w-full border rounded-md px-3 py-2"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              placeholder="Enter blog description"
              {...register('description', { required: 'Description is required' })}
              rows={5}
              className="w-full border rounded-md px-3 py-2"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block font-semibold mb-1">Image</label>
            <input
              type="file"
              {...register('image')}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
          >
            {isLoading ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Blog' : 'Add Blog')}
          </button>
        </form>
      </div>

      {/* Blogs List */}
      <h2 className="text-2xl font-bold mb-4">All Blogs</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {blogs.length ? blogs.map(blog => (
          <div key={blog._id} className="bg-white rounded-lg shadow p-4 flex flex-col">
            {blog.image && <img src={`http://localhost:5000${blog.image}`} alt={blog.title} className="w-full h-48 object-cover rounded mb-4" />}
            <h3 className="text-lg font-semibold">{blog.title}</h3>
            <p className="text-gray-700 mt-2">{blog.content}</p>
            <p className="text-gray-400 text-sm mt-2">Added: {new Date(blog.createdAt).toLocaleString()}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(blog)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        )) : <p>No blogs found.</p>}
      </div>
    </div>
  );
};

export default AddBlogs;
