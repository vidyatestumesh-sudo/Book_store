import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

const SUFI_ID = 2;
const PRECEPTS_ID = 3;

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminSufiCorner = () => {
  const [corners, setCorners] = useState([]);
  const [precepts, setPrecepts] = useState([]);
  const [activeTab, setActiveTab] = useState(SUFI_ID);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchCorners = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/home/corners`);
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
        if (withFiles.find((c) => c.id === SUFI_ID)) setActiveTab(SUFI_ID);
        else if (withFiles.length > 0) setActiveTab(withFiles[0].id);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Could not load corners from the server.");
        setLoading(false);
        Swal.fire("Error", "Could not load corners from the server.", "error");
      }
    };

    const fetchPrecepts = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/precepts`);
        if (!res.ok) throw new Error("Failed to fetch precepts");
        const data = await res.json();
        setPrecepts(data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Could not load precepts from the server.", "error");
      }
    };

    fetchCorners();
    fetchPrecepts();
  }, []);

  // ---------------- SUFI CORNER HELPERS ----------------
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
    const newSlide = { id: uuidv4(), image: "", text: "", author: "", imageFile: null };
    setCorners((prev) =>
      prev.map((corner) =>
        corner.id === activeTab ? { ...corner, slides: [...corner.slides, newSlide] } : corner
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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      Swal.fire("Error", "Please select an image", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setUploading(true);
      const res = await fetch(`${baseUrl}/api/precepts/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload precept");

      const newPrecept = await res.json();
      setPrecepts((prev) => [newPrecept, ...prev]);
      setSelectedFile(null);
      Swal.fire("Success", "Precept uploaded successfully!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to upload precept", "error");
    } finally {
      setUploading(false);
    }
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

      corners.forEach((corner) =>
        corner.slides.forEach((slide, idx) => {
          if (slide.imageFile)
            formData.append(`corner_${corner.id}_slide_${idx}_image`, slide.imageFile);
        })
      );

      const res = await fetch(`${baseUrl}/api/home/corners`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to update corners");
      Swal.fire("Success", "Corners updated successfully!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save changes", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- PRECEPTS HELPERS ----------------
  const handleDeletePrecept = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the precept.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      setDeletingId(id); // show spinner only on this button
      const res = await fetch(`${baseUrl}/api/precepts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete precept");

      setPrecepts((prev) => prev.filter((p) => p._id !== id));
      Swal.fire("Deleted!", "Precept has been removed.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not delete precept.", "error");
    } finally {
      setDeletingId(null); // reset after done
    }
  };


  const handleAddPrecept = async (file, title = "") => {
    if (!file) return Swal.fire("Error", "Please select an image first", "error");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);

    try {
      setUploading(true); // start loading
      const res = await fetch(`${baseUrl}/api/precepts/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add precept");

      const newPrecept = await res.json();
      setPrecepts((prev) => [newPrecept, ...prev]); // add to list
      Swal.fire("Success", "Precept added successfully!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to add precept", "error");
    } finally {
      setUploading(false); // stop loading
    }
  };

  // ---------------- UI ----------------
  const currentCorner = corners.find((c) => c.id === activeTab);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="container mt-[100px]">
      <div className="max-w-8xl mx-auto rounded-lg">
        {/* Tab Switch UX */}
        <div className="relative flex justify-center mb-8 bg-gray-200 rounded-full p-1 max-w-md mx-auto shadow-inner">
          <div
            className={`absolute top-1 left-1 w-1/2 h-10 bg-blue-600 rounded-full shadow-md transform transition-transform duration-300 ${activeTab === PRECEPTS_ID ? "translate-x-full" : ""
              }`}
          ></div>

          {[SUFI_ID, PRECEPTS_ID].map((id) => {
            const corner = corners.find((c) => c.id === id);
            const title =
              corner?.title || (id === SUFI_ID ? "Sufi Corner" : "Precepts of Spirituality");
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${activeTab === id
                  ? "text-white"
                  : "text-gray-700 hover:text-gray-900 hover:scale-105"
                  }`}
              >
                {title}
              </button>
            );
          })}
        </div>

        {/* PRECEPTS TAB */}
        {activeTab === PRECEPTS_ID ? (
          <div className="bg-white shadow-md mt-[50px] rounded-lg p-5 mb-12 border">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center">
              Precepts of Spirituality Images
            </h2>

            {/* Precepts grid */}
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
                  <button
                    onClick={() => handleDeletePrecept(precept._id)}
                    disabled={deletingId === precept._id}
                    className={`bg-red-500 text-white w-auto py-1 px-2 mt-2 rounded-[6px] text-xs flex items-center justify-center gap-2 ${deletingId === precept._id
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-red-600 transition-colors"
                      } block mx-auto`}
                  >
                    {deletingId === precept._id ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
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
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              ))}
            </div>
            {/* Upload input */}
            <div className="mb-6 mt-6 max-w-xs mx-auto">
              <form
                onSubmit={handleUpload}
                className="space-y-4"
              >
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="border px-3 py-2 rounded w-full"
                  disabled={uploading}
                />
                <button
                  type="submit"
                  disabled={uploading}
                  className={`bg-blue-600 text-white rounded px-4 py-2 w-full font-semibold flex items-center justify-center gap-2 ${uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                    }`}
                >
                  {uploading ? (
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
              </form>
            </div>


          </div>
        ) : (
          // SUFI CORNER TAB
          currentCorner && (
            <div className="bg-white shadow-md mt-[50px] rounded-lg p-5 mb-12 border">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-5 text-center">
                Editing : {currentCorner.title || "Sufi Corner"}
              </h2>

              {/* Title input */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={currentCorner.title}
                  onChange={(e) => updateCorner("title", e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                />
              </div>

              {/* Read More URL input */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Read More URL</label>
                <input
                  type="text"
                  value={currentCorner.readMoreUrl}
                  onChange={(e) => updateCorner("readMoreUrl", e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                />
              </div>

              {/* Slides */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Slides</h3>
                <div className="space-y-8">
                  {currentCorner.slides.map((slide, index) => (
                    <div key={slide.id || index} className="border rounded-lg p-4 relative">
                      {/* Image */}
                      <div className="mb-2">
                        <label className="block font-medium mb-1">Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(index, e.target.files[0])}
                        />
                        {slide.image && (
                          <img
                            src={slide.image}
                            alt={`Slide ${index + 1}`}
                            className="w-[120px] h-[120px] mt-2 object-cover rounded border"
                          />
                        )}
                      </div>

                      {/* Text */}
                      <div className="mb-2">
                        <label className="block font-medium mb-1">Text</label>
                        <textarea
                          value={slide.text}
                          onChange={(e) => updateSlide(index, "text", e.target.value)}
                          className="border px-3 py-2 rounded w-full"
                        />
                      </div>

                      {/* Author */}
                      <div className="mb-2">
                        <label className="block font-medium mb-1">Author</label>
                        <input
                          type="text"
                          value={slide.author}
                          onChange={(e) => updateSlide(index, "author", e.target.value)}
                          className="border px-3 py-2 rounded w-full"
                        />
                      </div>

                      {/* Remove Slide */}
                      <div className="mb-0 mt-2">
                        <button
                          type="button"
                          onClick={() => removeSlide(index)}
                          className="bg-red-500 text-white w-auto py-1 px-2 rounded-[6px] text-sm hover:bg-red-600 transition-colors"
                        >
                          Remove Slide
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Slide */}
                <button
                  type="button"
                  onClick={addSlide}
                  className="mt-4 bg-purple-600 text-white px-2 py-1 rounded-md hover:bg-purple-700 transition-transform transform hover:scale-105"
                >
                  Add Slide
                </button>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={
                  "bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                }
              >
                {loading ? (
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>Save All Changes</>
                )}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AdminSufiCorner;
