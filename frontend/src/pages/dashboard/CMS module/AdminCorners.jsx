import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const AdminCorners = () => {
  const [corners, setCorners] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch corners on mount
  useEffect(() => {
    const fetchCorners = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/home/corners`);
        if (!res.ok) throw new Error("Failed to fetch corners data");
        const data = await res.json();
        setCorners(data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch corners", "error");
      }
    };
    fetchCorners();
  }, []);

  const handleChange = (cornerIndex, e) => {
    const { name, value } = e.target;
    const updated = [...corners];
    updated[cornerIndex][name] = value;
    setCorners(updated);
  };

  const handleSlideChange = (cornerIndex, slideIndex, e) => {
    const { name, value } = e.target;
    const updated = [...corners];
    updated[cornerIndex].slides[slideIndex][name] = value;
    setCorners(updated);
  };

  const handleFileChange = (cornerIndex, slideIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const updated = [...corners];
    updated[cornerIndex].slides[slideIndex].file = file; // keep file
    updated[cornerIndex].slides[slideIndex].preview = URL.createObjectURL(file); // preview
    setCorners(updated);
  };

  const addSlide = (cornerIndex) => {
    const updated = [...corners];
    updated[cornerIndex].slides.push({ image: "", text: "", author: "" });
    setCorners(updated);
  };

  const removeSlide = (cornerIndex, slideIndex) => {
    const updated = [...corners];
    updated[cornerIndex].slides.splice(slideIndex, 1);
    setCorners(updated);
  };

  const handleSubmit = async (cornerIndex, id) => {
    setLoading(true);
    try {
      const corner = corners[cornerIndex];
      const formData = new FormData();

      formData.append("title", corner.title);
      formData.append("bgColor", corner.bgColor);
      formData.append("readMoreUrl", corner.readMoreUrl || "");

      // slides
      corner.slides.forEach((slide, idx) => {
        formData.append(`slides[${idx}][text]`, slide.text);
        formData.append(`slides[${idx}][author]`, slide.author || "");

        if (slide.file) {
          formData.append("slides", slide.file); // upload to cloudinary
        } else {
          formData.append(`slides[${idx}][image]`, slide.image); // keep old image
        }
      });

      const res = await fetch(`${baseUrl}/api/home/corners/${id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Update failed");

      Swal.fire("Updated!", "Corner updated successfully!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to update corner", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!corners.length) return <div>Loading Corners...</div>;

  return (
    <div className="container mt-[100px]">
      <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-[6px] px-2 py-1 shadow-md transition-transform transform hover:scale-105"
          >
            <ArrowBackIcon className="w-3 h-3" />
            Back
          </button>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
            Manage Corners
          </h2>
        </div>

        {corners.map((corner, cornerIndex) => (
          <div
            key={corner._id || cornerIndex}
            className="border rounded-lg p-6 mb-10 shadow-sm"
          >
            {/* Title */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={corner.title}
                onChange={(e) => handleChange(cornerIndex, e)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            {/* Background Color */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Background Color</label>
              <input
                type="color"
                name="bgColor"
                value={corner.bgColor}
                onChange={(e) => handleChange(cornerIndex, e)}
                className="w-20 h-10 border px-2 rounded"
              />
            </div>

            {/* Read More URL */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Read More URL</label>
              <input
                type="text"
                name="readMoreUrl"
                value={corner.readMoreUrl || ""}
                onChange={(e) => handleChange(cornerIndex, e)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            {/* Slides */}
            <h3 className="text-xl font-semibold mt-6 mb-3">Slides</h3>
            {corner.slides.map((slide, slideIndex) => (
              <div
                key={slideIndex}
                className="border rounded p-4 mb-4 bg-gray-50"
              >
                {/* Image Upload */}
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(cornerIndex, slideIndex, e)}
                  />
                  {slide.preview ? (
                    <img
                      src={slide.preview}
                      alt="Preview"
                      className="w-40 h-28 object-cover mt-2 rounded border"
                    />
                  ) : slide.image ? (
                    <img
                      src={slide.image}
                      alt="Slide"
                      className="w-40 h-28 object-cover mt-2 rounded border"
                    />
                  ) : null}
                </div>

                {/* Text */}
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Text</label>
                  <textarea
                    name="text"
                    value={slide.text}
                    onChange={(e) => handleSlideChange(cornerIndex, slideIndex, e)}
                    className="w-full border px-3 py-2 rounded"
                    rows={3}
                  />
                </div>

                {/* Author */}
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={slide.author || ""}
                    onChange={(e) => handleSlideChange(cornerIndex, slideIndex, e)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeSlide(cornerIndex, slideIndex)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Remove Slide
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addSlide(cornerIndex)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
            >
              + Add Slide
            </button>

            {/* Save Button */}
            <button
              type="button"
              onClick={() => handleSubmit(cornerIndex, corner._id)}
              disabled={loading}
              className={`py-2 mt-6 bg-blue-700 hover:bg-blue-800 transition text-white font-regular px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Updating..." : "Update Corner"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCorners;
