import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

const AdminReaderThoughts = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [thoughts, setThoughts] = useState([{ title: "", text: "", _id: null }]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosClient.get("/api/reader-thoughts");
        const data = res.data;
        if (data) {
          setTitle(data.title || "");
          if (data.image?.url) {
            setImagePreview({ url: data.image.url, mimeType: data.image.mimeType });
          }
          if (Array.isArray(data.thoughts) && data.thoughts.length > 0) {
            setThoughts(
              data.thoughts.map((t) => ({ title: t.title, text: t.text, _id: t._id }))
            );
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load existing data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview.url);
      }
    };
  }, [imagePreview]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const requiredWidth = 650;
      const requiredHeight = 655;

      const withinRange =
        Math.abs(img.width - requiredWidth) <= 25 &&
        Math.abs(img.height - requiredHeight) <= 25;

      if (withinRange) {
        saveFile(file, img);
        return;
      }

      Swal.fire({
        icon: "warning",
        title: `Image Size Warning`,
        html: `
          <p>Recommended: <b>${requiredWidth} × ${requiredHeight}px</b></p>
          <p>You uploaded: <b>${img.width} × ${img.height}px</b></p>
          <p>Do you want to use this image anyway?</p>
        `,
        showCancelButton: true,
        confirmButtonText: "Yes, use it",
        cancelButtonText: "No, re-upload",
      }).then((result) => {
        if (result.isConfirmed) saveFile(file, img);
        else e.target.value = "";
      });
    };
  };

  const saveFile = (file, img) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview({ url: reader.result, mimeType: file.type });
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleThoughtChange = (index, field, value) => {
    const updated = [...thoughts];
    updated[index][field] = value;
    setThoughts(updated);
  };

  const addThought = () => setThoughts([...thoughts, { title: "", text: "", _id: null }]);
  const removeThought = (index) => setThoughts(thoughts.filter((_, i) => i !== index));

  const getImageSrc = (url) => {
    if (!url) return "";
    if (url.startsWith("blob:")) return url;
    if (url.includes("drive.google.com")) {
      const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
      return match ? `/image/${match[1]}` : url;
    }
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    for (const t of thoughts) {
      if (!t.title.trim() || !t.text.trim()) {
        setError("Please fill all thought titles and texts.");
        return;
      }
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("title", title);
      if (imageFile) formData.append("file", imageFile);
      formData.append("thoughts", JSON.stringify(thoughts));

      const res = await axios.post("/api/reader-thoughts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data;
      setTitle(data.title);
      setImagePreview(data.image?.url ? { url: data.image.url, mimeType: data.image.mimeType } : null);
      setThoughts(Array.isArray(data.thoughts) ? data.thoughts.map((t) => ({ title: t.title, text: t.text, _id: t._id })) : [{ title: "", text: "", _id: null }]);
      Swal.fire("Success", "Reader Thoughts updated successfully!", "success");
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Submission failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="container mt-[100px]">
      <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
        {/* Back + Title */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-[6px] px-2 py-1 shadow-md transition-transform transform hover:scale-105"
          >
            <ArrowBackIcon className="w-3 h-3" />
            Back
          </button>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
            Edit Reader Thoughts
          </h2>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Image selection + preview */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Right: Image preview */}
          <div className="md:w-1/4 flex justify-center items-center border-gray-300 rounded-md p-2">
            {imagePreview?.url ? (
              <img
                src={getImageSrc(imagePreview.url)}
                alt="Preview"
                className="w-[180px] h-[180px] object-cover rounded-md"
              />
            ) : (
              <p className="text-gray-400">No image selected</p>
            )}
          </div>
          <div className="md:w-1/2 flex flex-col gap-3">
            <label className="block font-medium">Select Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="block"
              disabled={uploading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended size: <span className="font-semibold">740 × 710 px</span>
            </p>
          </div>
        </div>

        {/* Full width content below */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              disabled={uploading}
            />
          </div>

          {/* Thoughts */}
          <div>
            <label className="block mb-2 font-medium">Thoughts</label>
            {thoughts.map((thought, index) => (
              <div
                key={thought._id || index}
                className="mb-6 p-4 border border-gray-300 rounded-md shadow-sm flex flex-col"
              >
                {/* Thought inputs */}
                <input
                  type="text"
                  placeholder="Thought Title"
                  value={thought.title}
                  onChange={(e) => handleThoughtChange(index, "title", e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
                  disabled={uploading}
                />
                <textarea
                  placeholder="Thought Text"
                  value={thought.text}
                  onChange={(e) => handleThoughtChange(index, "text", e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
                  rows={4}
                  disabled={uploading}
                />

                {/* Remove button below text, left-aligned */}
                {thoughts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeThought(index)}
                    className="bg-red-500 text-white w-20 py-1 rounded-[6px] text-sm hover:bg-red-600 transition-colors"
                    disabled={uploading}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addThought}
              className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105"
              disabled={uploading}
            >
              + Add Another Thought
            </button>
          </div>


          {/* Submit */}
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminReaderThoughts;
