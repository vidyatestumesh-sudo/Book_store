import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

const AdminCorners = () => {
  const [corners, setCorners] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchCorners = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/home/corners`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setCorners(data);
        if (data.length > 0) setActiveTab(data[0].id);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch corners:", err);
        setError("Could not load corners from the server.");
        setLoading(false);
        Swal.fire("Error", "Could not load corners from the server.", "error");
      }
    };

    fetchCorners();
  }, [baseUrl]);

  const updateCorner = (field, value) => {
    setCorners((prevCorners) => {
      const updated = [...prevCorners];
      const index = updated.findIndex((c) => c.id === activeTab);
      if (index !== -1) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const updateSlide = (slideIndex, field, value) => {
    setCorners((prevCorners) => {
      const updated = [...prevCorners];
      const cornerIndex = updated.findIndex((c) => c.id === activeTab);
      if (cornerIndex !== -1) {
        const slides = [...updated[cornerIndex].slides];
        slides[slideIndex] = { ...slides[slideIndex], [field]: value };
        updated[cornerIndex] = { ...updated[cornerIndex], slides };
      }
      return updated;
    });
  };

  const handleImageChange = (slideIndex, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCorners((prevCorners) => {
        const updated = [...prevCorners];
        const cornerIndex = updated.findIndex((c) => c.id === activeTab);
        if (cornerIndex !== -1) {
          const slides = [...updated[cornerIndex].slides];
          slides[slideIndex] = {
            ...slides[slideIndex],
            image: reader.result,
            imageFile: file,
          };
          updated[cornerIndex] = { ...updated[cornerIndex], slides };
        }
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const addSlide = () => {
    const newSlide = {
      id: uuidv4(),
      image: "",
      text: "",
      author: "",
      imageFile: null,
    };
    setCorners((prevCorners) => {
      const updated = [...prevCorners];
      const index = updated.findIndex((c) => c.id === activeTab);
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          slides: [...updated[index].slides, newSlide],
        };
      }
      return updated;
    });
  };

  const removeSlide = (slideIndex) => {
    setCorners((prevCorners) => {
      const updated = [...prevCorners];
      const index = updated.findIndex((c) => c.id === activeTab);
      if (index !== -1) {
        const slides = [...updated[index].slides];
        slides.splice(slideIndex, 1);
        updated[index] = { ...updated[index], slides };
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("corners", JSON.stringify(corners));

      corners.forEach((corner) => {
        corner.slides.forEach((slide, slideIndex) => {
          if (slide.imageFile) {
            const key = `corner_${corner.id}_slide_${slideIndex}_image`;
            formData.append(key, slide.imageFile);
          }
        });
      });

      const res = await fetch(`${baseUrl}/api/home/corners`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update corners");

      Swal.fire("Success", "Corners updated successfully!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save changes", "error");
    } finally {
      setLoading(false);
    }
  };

  const currentCorner = corners.find((corner) => corner.id === activeTab);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-10 font-Figtree">
      <h1 className="text-3xl font-bold text-center mb-10">Admin Corners</h1>

      {/* Tab Switch UX */}
      <div className="relative flex justify-center mb-8 bg-gray-200 rounded-full p-1 max-w-md mx-auto shadow-inner">
        <div
          className={`absolute top-1 left-1 w-1/2 h-10 bg-blue-600 rounded-full shadow-md transform transition-transform duration-300 ${
            activeTab === 2 ? "translate-x-full" : ""
          }`}
        ></div>

        {corners.map((corner) => (
          <button
            key={corner.id}
            onClick={() => setActiveTab(corner.id)}
            className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${
              activeTab === corner.id
                ? "text-white"
                : "text-gray-700 hover:text-gray-900 hover:scale-105"
            }`}
          >
            {corner.title}
          </button>
        ))}
      </div>

      {/* Active Corner Form */}
      {currentCorner ? (
        <div className="bg-white shadow-md rounded-lg p-6 mb-12 border">
          <h2 className="text-xl font-semibold mb-4">
            Editing: {currentCorner.title}
          </h2>

          {/* Title */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              value={currentCorner.title}
              onChange={(e) => updateCorner("title", e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          {/* Read More URL (optional) */}
          {currentCorner.readMoreUrl !== undefined && (
            <div className="mb-4">
              <label className="block font-medium mb-1">Read More URL</label>
              <input
                type="text"
                value={currentCorner.readMoreUrl}
                onChange={(e) => updateCorner("readMoreUrl", e.target.value)}
                className="border px-3 py-2 rounded w-full"
              />
            </div>
          )}

          {/* Slides */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Slides</h3>
            <div className="space-y-8">
              {currentCorner.slides.map((slide, slideIndex) => (
                <div
                  key={slide.id || slideIndex}
                  className="border rounded-lg p-4 relative"
                >
                  {/* Image */}
                  <div className="mb-2">
                    <label className="block font-medium mb-1">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(slideIndex, e.target.files[0])
                      }
                    />
                    {slide.image && (
                      <img
                        src={slide.image}
                        alt="Slide"
                        className="w-[120px] h-[120px] mt-2 object-cover rounded border"
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div className="mb-2">
                    <label className="block font-medium mb-1">Text</label>
                    <textarea
                      value={slide.text}
                      onChange={(e) =>
                        updateSlide(slideIndex, "text", e.target.value)
                      }
                      className="border px-3 py-2 rounded w-full"
                    />
                  </div>

                  {/* Author */}
                  <div className="mb-2">
                    <label className="block font-medium mb-1">Author</label>
                    <input
                      type="text"
                      value={slide.author || ""}
                      onChange={(e) =>
                        updateSlide(slideIndex, "author", e.target.value)
                      }
                      className="border px-3 py-2 rounded w-full"
                    />
                  </div>

                  {/* Remove Slide */}
                  <button
                    type="button"
                    onClick={() => removeSlide(slideIndex)}
                    className="absolute top-3 right-3 text-red-600 hover:underline text-sm"
                  >
                    Remove Slide
                  </button>
                </div>
              ))}
            </div>

            {/* Add Slide */}
            <button
              type="button"
              onClick={addSlide}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Slide
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading corner...</p>
      )}

      {/* Save Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 block mx-auto ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
};

export default AdminCorners;
