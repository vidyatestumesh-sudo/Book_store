import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { CalendarToday as CalendarTodayIcon } from "@mui/icons-material";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const BACKEND_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://bookstore-backend-hshq.onrender.com";

const AdminInspirationBoard = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: { title: "", description: "", image: null },
  });
  
  const [inspirationImages, setInspirationImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]); // holds inspiration items
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" or "form"
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("adminToken");

  // Fetch inspiration images
  const fetchInspirationImages = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/inspiration-images`);
      const data = await res.json();
      setInspirationImages(data);
    } catch (err) {
      console.error("Failed to fetch inspiration images", err);
    }
  };

  useEffect(() => {
    fetchInspirationImages();
  }, []);

  // Fetch inspirations (blogs with type === "inspiration")
  const fetchInspirations = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
      const data = await res.json();
      const insp = data
        .filter((b) => b.type === "inspiration")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setItems(insp);
    } catch (err) {
      console.error("Failed to fetch inspirations", err);
    }
  };

  useEffect(() => {
    fetchInspirations();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const form = e.target;
    const file = form.image.files[0];
    const title = form.title.value.trim();

    if (!file) {
      Swal.fire("Error", "Please select an image to upload", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_BASE_URL}/api/inspiration-images/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const newImage = await res.json();
      setInspirationImages((prev) => [...prev, newImage]);
      Swal.fire("Success", "Image uploaded successfully!", "success");
      form.reset();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to upload image", "error");
    } finally {
      setLoading(false);
    }
  };

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
      formData.append("type", "inspiration");

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const url = editingId
        ? `${BACKEND_BASE_URL}/api/blogs/edit/${editingId}`
        : `${BACKEND_BASE_URL}/api/blogs/create-blog`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire(
          editingId ? "Updated" : "Added",
          editingId
            ? "Inspiration updated successfully!"
            : "Inspiration added successfully!",
          "success"
        );
        reset();
        setDescription("");
        setEditingId(null);
        setViewMode("list");
        fetchInspirations();
      } else {
        Swal.fire("Error", result.message || "Something went wrong", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setValue("title", item.title);
    setDescription(item.description);
    setViewMode("form");
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the inspiration!",
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();

      if (res.ok) {
        Swal.fire("Deleted!", "Inspiration has been deleted.", "success");
        fetchInspirations();
      } else {
        Swal.fire("Error", result.message || "Failed to delete", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete", "error");
    }
  };

  // InspirationCard component nested here
  const InspirationCard = ({ item }) => {
    const [expanded, setExpanded] = useState(false);
    const contentRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState(0);

    const toggleExpand = () => setExpanded(!expanded);

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
            node.textContent =
              words.slice(0, wordLimit - wordCount).join(" ") + "...";
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
    }, [expanded, item.description]);

    const plainText = item.description.replace(/<[^>]+>/g, "");
    const words = plainText.split(" ");
    const isLong = words.length > 40;
        return (
            <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition duration-500">
                <div className="flex flex-col lg:flex-row">
                    {item.image && (
                        <div className="lg:w-1/3 bg-gray-100 flex items-center justify-center p-4">
                            <div className="w-full h-48 lg:h-64 overflow-hidden rounded-lg">
                                <img
                                    src={
                                        item.image.startsWith("http")
                                            ? item.image
                                            : `${BACKEND_BASE_URL}${img.image}`
                                    }
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}
                    <div className="lg:w-2/3 p-6 flex flex-col justify-between">
                        <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                        <p className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                            <CalendarTodayIcon fontSize="small" />
                            {new Date(item.createdAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>

                        {isLong ? (
                            <>
                                <div
                                    className="text-gray-700 text-sm leading-relaxed mb-2"
                                    dangerouslySetInnerHTML={{
                                        __html: truncateHTML(item.description, 40),
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={toggleExpand}
                                    className="text-blue-700 hover:text-blue-900 font-medium mt-2 flex items-center gap-1"
                                >
                                    {expanded ? "Hide Description" : "Read More"}{" "}
                                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </button>
                            </>
                        ) : (
                            <div
                                className="text-gray-700 text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                        )}

                        {/* Edit/Delete Buttons */}
                        <div className="mt-4 flex gap-2 flex-wrap justify-center">
                            <button
                                onClick={() => handleEdit(item)}
                                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-md shadow-md transition flex items-center gap-1"
                            >
                                <FiEdit fontSize="small" /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md shadow-md transition flex items-center gap-1"
                            >
                                <FiTrash2 fontSize="small" /> Delete
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
                        dangerouslySetInnerHTML={{ __html: item.description }}
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
                        <div
                            className={`absolute top-1 left-1 w-1/2 h-10 bg-blue-600 rounded-full shadow-md transform transition-transform duration-300 ${viewMode === "form" ? "translate-x-full" : ""
                                }`}
                        ></div>

                        <button
                            className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${viewMode === "list"
                                ? "text-white"
                                : "text-gray-700 hover:text-gray-900 hover:scale-105"
                                }`}
                            onClick={() => setViewMode("list")}
                        >
                            <LibraryBooksIcon fontSize="medium" /> View Inspirations
                        </button>

                        <button
                            className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${viewMode === "form"
                                ? "text-white"
                                : "text-gray-700 hover:text-gray-900 hover:scale-105"
                                }`}
                            onClick={() => {
                                setViewMode("form");
                                reset();
                                setEditingId(null);
                                setDescription("");
                            }}
                        >
                            <FiEdit fontSize="medium" /> Add Inspiration
                        </button>
                    </div>

                    {/* Add / Edit Form */}
                    {viewMode === "form" && (
                        <div className="mt-[50px]">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl rounded-2xl p-8 mb-10 border border-gray-500 transition-all duration-500">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                                    {editingId ? "Edit Inspiration" : "Add New Inspiration"}
                                </h2>
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    encType="multipart/form-data"
                                    className="space-y-5"
                                >
                                    <div>
                                        <label className="block font-semibold mb-1 text-gray-800">Title</label>
                                        <input
                                            type="text"
                                            placeholder="Enter title"
                                            {...register("title", { required: "Title is required" })}
                                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                        />
                                        {errors.title && (
                                            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block font-semibold mb-1 text-gray-800">Description</label>
                                        <ReactQuill
                                            theme="snow"
                                            value={description}
                                            onChange={setDescription}
                                            placeholder="Write content here..."
                                            className="bg-white rounded"
                                        />
                                        {!description && (
                                            <p className="text-red-500 text-sm mt-1">Description is required</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block font-semibold mb-1 text-gray-800">Image (optional)</label>
                                        <input
                                            type="file"
                                            {...register("image")}
                                            className="w-full border rounded-lg px-4 py-2"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`py-2 mt-4 bg-blue-700 hover:bg-blue-800 transition text-white font-bold px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v8H4z"
                                                    />
                                                </svg>
                                                {editingId ? "Updating..." : "Adding..."}
                                            </>
                                        ) : (
                                            editingId ? "Update" : "Add"
                                        )}
                                    </button>
                                </form>
                            </div>
                            <div className="bg-white shadow-md rounded-lg p-6 mb-12 border">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Inspiration Images
      </h2>

      {/* Upload input */}
      <div className="mb-6 max-w-md mx-auto">
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Enter title (optional)"
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            className="border px-3 py-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 w-full font-semibold"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      {/* Images grid */}
<div className="grid grid-cols-3 gap-4">
  {inspirationImages.length === 0 && (
    <p className="text-gray-500 col-span-3 text-center">
      No inspiration images found.
    </p>
  )}

  {inspirationImages.map((img) => (
    <div
      key={img._id}
      className="border rounded-lg p-2 overflow-hidden relative group"
    >
      <img
        src={
          img.imageUrl // Use the correct property from your DB/model
            ? img.imageUrl.startsWith("http")
              ? img.imageUrl
              : `${BACKEND_BASE_URL}${img.imageUrl}`
            : "/default-image.png" // Make sure this image exists in your public folder or imported
        }
        alt={img.title || "Inspiration Image"}
        className="w-full h-32 object-cover rounded"
      />

      <button
        onClick={() => handleDelete(img._id)}
        className="text-xs text-red-600 hover:underline mt-2 block text-center"
      >
        Delete
      </button>
    </div>
  ))}
</div>

    </div>
                        </div>
                    )}

                    {/* List View */}
                    {viewMode === "list" && (
                        <div className="mt-[50px]">
                            <div className="flex flex-col gap-8">
                                {items.length > 0 ? (
                                    items.map((item) => <InspirationCard key={item._id} item={item} />)
                                ) : (
                                    <p className="text-gray-500 text-center py-6">
                                        No inspirations found.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminInspirationBoard;
