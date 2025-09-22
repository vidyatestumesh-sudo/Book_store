import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminReaderThoughts = () => {
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);  // now object or null
  const [uploading, setUploading] = useState(false);

  const [thoughts, setThoughts] = useState([{ title: "", text: "", _id: null }]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/reader-thoughts");
        const data = res.data;
        if (data) {
          setTitle(data.title || "");
          if (data.image?.url) {
            // Set as object with url and mimeType
            setImagePreview({ url: data.image.url, mimeType: data.image.mimeType });
          }
          if (Array.isArray(data.thoughts) && data.thoughts.length > 0) {
            setThoughts(
              data.thoughts.map((t) => ({
                title: t.title,
                text: t.text,
                _id: t._id,
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch reader thoughts:", err);
        setError("Failed to load existing data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cleanup blob URLs when component unmounts or imagePreview changes
  React.useEffect(() => {
    return () => {
      if (imagePreview?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview.url);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);

    // Create preview from the selected file (as object)
    const localPreviewUrl = URL.createObjectURL(file);
    setImagePreview({ url: localPreviewUrl, mimeType: file.type });
  };

  const handleThoughtChange = (index, field, value) => {
    const updated = [...thoughts];
    updated[index][field] = value;
    setThoughts(updated);
  };

  const addThought = () => {
    setThoughts([...thoughts, { title: "", text: "", _id: null }]);
  };

  const removeThought = (index) => {
    const updated = thoughts.filter((_, i) => i !== index);
    setThoughts(updated);
  };

  // Extract Google Drive file ID from a URL
  const extractGoogleDriveFileId = (url) => {
    if (!url) return null;
    const regex = /(?:\/d\/|id=)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Get image src, proxying Google Drive URLs through backend
  const getImageSrc = (url) => {
    if (!url) return "";
    if (url.startsWith("blob:")) {
      // Local preview blob URL
      return url;
    }
    // If Google Drive URL, proxy through backend
    if (url.includes("drive.google.com")) {
      const fileId = extractGoogleDriveFileId(url);
      if (fileId) {
        return `/image/${fileId}`;
      }
    }
    // Otherwise return the original URL
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

      if (imageFile) {
        formData.append("file", imageFile);
      }

      // Send thoughts array (stringified)
      formData.append("thoughts", JSON.stringify(thoughts));

      const res = await axios.post("/api/reader-thoughts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data;
      // After successful save, reset states from the response
      setTitle(data.title);
      if (data.image?.url) {
        setImagePreview({ url: data.image.url, mimeType: data.image.mimeType });
      } else {
        setImagePreview(null);
      }
      if (Array.isArray(data.thoughts)) {
        setThoughts(
          data.thoughts.map((t) => ({
            title: t.title,
            text: t.text,
            _id: t._id,
          }))
        );
      } else {
        setThoughts([{ title: "", text: "", _id: null }]);
      }

      setSuccess(true);
    } catch (err) {
      console.error("Submission failed:", err);
      setError("Submission failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-md shadow-md mt-10">
      <h1 className="text-2xl font-semibold mb-6">Edit Reader Thoughts</h1>

      {success && (
        <p className="text-green-600 mb-4">Changes saved successfully!</p>
      )}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-10">
        {/* Left Side: Image */}
        <div className="md:w-1/3">
          <label className="block mb-1 font-medium">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*,application/pdf"
            className="block mb-2"
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
          {imagePreview?.url && (
            <>
              {imagePreview.mimeType.startsWith("image/") ? (
                <img
                  src={getImageSrc(imagePreview.url)}
                  alt="Preview"
                  onError={(e) => { e.target.src = ""; }}
                  className="mt-2 h-64 w-full object-cover rounded-md border border-gray-300"
                />
              ) : imagePreview.mimeType === "application/pdf" ? (
                <iframe
                  src={getImageSrc(imagePreview.url)}
                  title="PDF Preview"
                  className="mt-2 w-full h-64 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="text-sm text-gray-500 mt-2">Unsupported preview format</p>
              )}
            </>
          )}
        </div>

        {/* Right Side: Title and Thoughts */}
        <div className="md:w-2/3 flex flex-col gap-6">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              disabled={uploading}
            />
          </div>

          {/* Thoughts */}
          <div>
            <label className="block mb-2 font-medium">Thoughts</label>
            {thoughts.map((thought, index) => (
              <div
                key={thought._id || index}
                className="mb-4 p-4 border border-gray-300 rounded-md space-y-3 relative"
              >
                {thoughts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeThought(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                    disabled={uploading}
                  >
                    Remove
                  </button>
                )}
                <input
                  type="text"
                  placeholder="Thought Title"
                  value={thought.title}
                  onChange={(e) =>
                    handleThoughtChange(index, "title", e.target.value)
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  disabled={uploading}
                />
                <textarea
                  placeholder="Thought Text"
                  value={thought.text}
                  onChange={(e) =>
                    handleThoughtChange(index, "text", e.target.value)
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  rows={4}
                  disabled={uploading}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addThought}
              className="text-blue-600 font-medium hover:underline"
              disabled={uploading}
            >
              + Add Another Thought
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="self-start bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminReaderThoughts;
