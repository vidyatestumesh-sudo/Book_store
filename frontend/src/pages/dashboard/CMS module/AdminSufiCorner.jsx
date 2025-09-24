import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

const SUFI_ID = 2;
const PRECEPTS_ID = 3;

const AdminSufiCorner = () => {
  const [corners, setCorners] = useState([]);
  const [precepts, setPrecepts] = useState([]);
  const [activeTab, setActiveTab] = useState(SUFI_ID);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCorners = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/home/corners");
        if (!res.ok) throw new Error("Failed to fetch corners");
        const data = await res.json();
        const withFiles = data.map((corner) => ({
          ...corner,
          title: corner.title ?? "",
          readMoreUrl: corner.readMoreUrl ?? "",
          slides: corner.slides.map((slide) => ({
            ...slide,
            text: slide.text ?? "",
            author: slide.author ?? "",
            image: slide.image ?? "",
            imageFile: null,
          })),
        }));
        setCorners(withFiles);

        if (withFiles.find((c) => c.id === SUFI_ID)) {
          setActiveTab(SUFI_ID);
        } else if (withFiles.length > 0) {
          setActiveTab(withFiles[0].id);
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Could not load corners from the server.", "error");
      }
    };

    const fetchPrecepts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/precepts");
        if (!res.ok) throw new Error("Failed to fetch precepts");
        const data = await res.json();
        setPrecepts(data);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Could not load precepts from the server.", "error");
      }
    };

    fetchCorners();
    fetchPrecepts();
  }, []);

  const updateCorner = (field, value) => {
    setCorners((prev) =>
      prev.map((corner) =>
        corner.id === activeTab ? { ...corner, [field]: value } : corner
      )
    );
  };

  const updateSlide = (slideIndex, field, value) => {
    setCorners((prev) =>
      prev.map((corner) => {
        if (corner.id !== activeTab) return corner;
        const slides = [...corner.slides];
        slides[slideIndex] = { ...slides[slideIndex], [field]: value };
        return { ...corner, slides };
      })
    );
  };

  const handleImageChange = (slideIndex, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCorners((prev) =>
        prev.map((corner) => {
          if (corner.id !== activeTab) return corner;
          const slides = [...corner.slides];
          slides[slideIndex] = {
            ...slides[slideIndex],
            image: reader.result,
            imageFile: file,
          };
          return { ...corner, slides };
        })
      );
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
    setCorners((prev) =>
      prev.map((corner) =>
        corner.id === activeTab
          ? { ...corner, slides: [...corner.slides, newSlide] }
          : corner
      )
    );
  };

  const removeSlide = (slideIndex) => {
    setCorners((prev) =>
      prev.map((corner) => {
        if (corner.id !== activeTab) return corner;
        const slides = [...corner.slides];
        slides.splice(slideIndex, 1);
        return { ...corner, slides };
      })
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      const cornersToSend = corners.map(({ slides, ...corner }) => ({
        ...corner,
        slides: slides.map(({ imageFile, ...slide }) => slide),
      }));

      formData.append("corners", JSON.stringify(cornersToSend));

      corners.forEach((corner) => {
        corner.slides.forEach((slide, idx) => {
          if (slide.imageFile) {
            formData.append(
              `corner_${corner.id}_slide_${idx}_image`,
              slide.imageFile
            );
          }
        });
      });

      const res = await fetch("http://localhost:5000/api/home/corners", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update corners");

      Swal.fire("Success", "Corners updated successfully!", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to save changes", "error");
    } finally {
      setLoading(false);
    }
  };

  const currentCorner = corners.find((corner) => corner.id === activeTab);

  return (
    <div className="container mx-auto px-4 py-10 font-Figtree max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-10">Admin Corners</h1>

      {/* Tabs */}
      <div className="relative flex justify-center mb-8 bg-gray-200 rounded-full p-1 max-w-md mx-auto shadow-inner">
        <div
          className={`absolute top-1 left-1 w-1/2 h-10 bg-blue-600 rounded-full shadow-md transform transition-transform duration-300 ${
            activeTab === PRECEPTS_ID ? "translate-x-full" : ""
          }`}
        ></div>

        {[SUFI_ID, PRECEPTS_ID].map((id) => {
          const corner = corners.find((c) => c.id === id);
          const title = corner
            ? corner.title
            : id === SUFI_ID
            ? "Sufi Corner"
            : "Precepts of Spirituality";
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${
                activeTab === id
                  ? "text-white"
                  : "text-gray-700 hover:text-gray-900 hover:scale-105"
              }`}
            >
              {title}
            </button>
          );
        })}
      </div>

      {/* Precepts tab */}
      {activeTab === PRECEPTS_ID ? (
        <div className="bg-white shadow-md rounded-lg p-6 mb-12 border">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Precepts of Spirituality Images
          </h2>

          {/* Upload input at the top */}
          {/* Upload form with title + image */}
<div className="mb-6 max-w-md mx-auto">
  <label className="block font-medium mb-2">Upload New Precept Image</label>

  <form
    onSubmit={async (e) => {
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
        const res = await fetch("http://localhost:5000/api/precepts/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const newPrecept = await res.json();
        setPrecepts((prev) => [...prev, newPrecept]);
        Swal.fire("Success", "Image uploaded successfully!", "success");
        form.reset();
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to upload image", "error");
      } finally {
        setLoading(false);
      }
    }}
    className="space-y-4"
  >
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


          {/* Images grid: 3 per row */}
          <div className="grid grid-cols-3 gap-4">
            {precepts.length === 0 && (
              <p className="text-gray-500 col-span-3 text-center">
                No precept images found.
              </p>
            )}
            {precepts.map((precept) => (
  <div
    key={precept._id}
    className="border rounded-lg p-2 overflow-hidden relative group"
  >
    <img
      src={precept.imageUrl}
      alt={precept.title || "Precept"}
      className="w-full h-32 object-cover rounded"
    />
    {/* {precept.title && (
      <p className="text-sm mt-2 text-center text-gray-700">{precept.title}</p>
    )} */}

    <button
      onClick={async () => {
        try {
          const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will delete the precept permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
          });

          if (confirm.isConfirmed) {
            const res = await fetch(
              `http://localhost:5000/api/precepts/${precept._id}`,
              { method: "DELETE" }
            );

            if (!res.ok) throw new Error("Delete failed");

            setPrecepts((prev) =>
              prev.filter((p) => p._id !== precept._id)
            );

            Swal.fire("Deleted!", "Precept has been deleted.", "success");
          }
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Failed to delete precept", "error");
        }
      }}
      className="text-xs text-red-600 hover:underline mt-2 block text-center"
    >
      Delete
    </button>
  </div>
))}

          </div>
        </div>
      ) : currentCorner ? (
        <div className="bg-white shadow-md rounded-lg p-6 mb-12 border">
          <h2 className="text-xl font-semibold mb-4">Editing: {currentCorner.title ?? ""}</h2>

          {/* Title */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              value={currentCorner.title ?? ""}
              onChange={(e) => updateCorner("title", e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          {/* Optional Read More URL */}
          {currentCorner.readMoreUrl !== undefined && (
            <div className="mb-4">
              <label className="block font-medium mb-1">Read More URL</label>
              <input
                type="text"
                value={currentCorner.readMoreUrl ?? ""}
                onChange={(e) => updateCorner("readMoreUrl", e.target.value)}
                className="border px-3 py-2 rounded w-full"
                placeholder="Optional"
              />
            </div>
          )}

          {/* Slides */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Slides</h3>
            {currentCorner.slides.length === 0 && (
              <p className="text-gray-500 mb-4">No slides yet.</p>
            )}
            {currentCorner.slides.map((slide, slideIndex) => (
              <div
                key={slide.id || slideIndex}
                className="mb-6 p-4 border rounded"
              >
                <div className="mb-2">
                  <label className="block font-medium mb-1">Image</label>
                  {slide.image ? (
                    <img
                      src={slide.image}
                      alt="Slide"
                      className="w-40 h-24 object-cover rounded mb-2"
                    />
                  ) : (
                    <p className="text-gray-500 mb-2">No image selected</p>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(slideIndex, e.target.files[0])}
                    className="border px-3 py-2 rounded w-full"
                  />
                </div>

                <div className="mb-2">
                  <label className="block font-medium mb-1">Text</label>
                  <textarea
                    value={slide.text ?? ""}
                    onChange={(e) => updateSlide(slideIndex, "text", e.target.value)}
                    className="border px-3 py-2 rounded w-full"
                  />
                </div>

                <div className="mb-2">
                  <label className="block font-medium mb-1">Author</label>
                  <input
                    type="text"
                    value={slide.author ?? ""}
                    onChange={(e) =>
                      updateSlide(slideIndex, "author", e.target.value)
                    }
                    className="border px-3 py-2 rounded w-full"
                  />
                </div>

                <button
                  onClick={() => removeSlide(slideIndex)}
                  className="bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1 mt-2"
                >
                  Remove Slide
                </button>
              </div>
            ))}

            <button
              onClick={addSlide}
              className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2"
            >
              Add Slide
            </button>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-3 font-semibold disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No corner selected</p>
      )}
    </div>
  );
};

export default AdminSufiCorner;
