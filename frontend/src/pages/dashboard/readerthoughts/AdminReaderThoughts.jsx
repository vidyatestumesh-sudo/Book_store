import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminReaderThoughts = () => {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [thoughts, setThoughts] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing ReaderThoughts on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/reader-thoughts");
        if (data) {
          setTitle(data.title || "");
          setImagePreview(data.image || null);
          setThoughts(data.thoughts || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleThoughtChange = (index, field, value) => {
    const updatedThoughts = [...thoughts];
    updatedThoughts[index][field] = value;
    setThoughts(updatedThoughts);
  };

  const addThought = () => {
    setThoughts([...thoughts, { _id: `new-${Date.now()}`, title: "", text: "" }]);
  };

  const removeThought = (index) => {
    if (thoughts.length === 1) return;
    const updatedThoughts = [...thoughts];
    updatedThoughts.splice(index, 1);
    setThoughts(updatedThoughts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!title.trim()) {
      setError("Title is required.");
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
      if (imageFile) formData.append("image", imageFile);

      // Only send new thoughts (without _id)
      const newThoughts = thoughts.filter((t) => !t._id || t._id.toString().startsWith("new-"));
      formData.append("thoughts", JSON.stringify(newThoughts));

      await axios.post("/api/reader-thoughts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
    } catch (err) {
      console.error("Submission failed:", err);
      setError("Submission failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-md shadow-md mt-10">
      <h1 className="text-2xl font-semibold mb-6">Add Reader Thoughts</h1>

      {success && (
        <p className="text-green-600 mb-4">Reader Thoughts saved successfully!</p>
      )}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-10">
        {/* Left: Image */}
        <div className="md:w-1/3">
          <label className="block mb-1 font-medium">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="block mb-2"
            disabled={uploading}
          />

          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 h-64 w-full object-cover rounded-md border border-gray-300"
            />
          )}
        </div>

        {/* Right: Title and Thoughts */}
        <div className="md:w-2/3 flex flex-col gap-6">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              required
              disabled={uploading}
            />
          </div>

          {/* Thoughts */}
          <div>
            <label className="block mb-2 font-medium">Thoughts</label>
            {thoughts.map((thought, index) => (
              <div
                key={thought._id || `new-${index}`}
                className="mb-4 p-4 border border-gray-300 rounded-md space-y-3 relative"
              >
                {thoughts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeThought(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                    aria-label={`Remove thought ${index + 1}`}
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
                  required
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
                  required
                  disabled={uploading}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addThought}
              className="text-blue-600 font-medium hover:underline mt-2"
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
            {uploading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminReaderThoughts;
