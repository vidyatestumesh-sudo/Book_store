import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdminSufiCorner = () => {
  const [activeTab, setActiveTab] = useState("sufi"); // "sufi" or "precepts"
  const [sufiData, setSufiData] = useState({ title: "", content: "" });
  const [preceptsImage, setPreceptsImage] = useState(null);
  const [preceptsImageFile, setPreceptsImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch data for both sections from backend
    const fetchData = async () => {
      try {
        // Example endpoints — adjust to your backend routes
        const res1 = await fetch("http://localhost:5000/api/home/sufi-corner");
        const sufi = await res1.json();
        setSufiData(sufi);

        // const res2 = await fetch(
        //   "http://localhost:5000/api/home/precepts-of-spirituality"
        // );
        const pre = await res2.json();
        if (pre.image) {
          setPreceptsImage(pre.image);
        }
      } catch (err) {
        console.error("Error fetching admin sufi/precepts data:", err);
        Swal.fire("Error", "Unable to load data", "error");
      }
    };

    fetchData();
  }, []);

  const handleSufiChange = (field, value) => {
    setSufiData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPreceptsImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreceptsImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (activeTab === "sufi") {
        // Save sufi content
        const res = await fetch("http://localhost:5000/api/home/sufi-corner", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sufiData),
        });
        if (!res.ok) throw new Error("Failed saving sufi");
        Swal.fire("Success", "Sufi Corner saved", "success");
      } else {
        // Save precepts image
        const formData = new FormData();
        formData.append("image", preceptsImageFile);

        const res = await fetch(
          "http://localhost:5000/api/home/precepts-of-spirituality",
          {
            method: "POST",
            body: formData,
          }
        );
        if (!res.ok) throw new Error("Failed uploading precepts image");
        Swal.fire("Success", "Precepts image saved", "success");
      }
    } catch (err) {
      console.error("Error on submit:", err);
      Swal.fire("Error", "Save failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 font-Figtree">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Sufi / Precepts</h1>

      {/* Toggle switch UI */}
      <div className="relative flex justify-center mb-8 bg-gray-200 rounded-full p-1 max-w-md mx-auto shadow-inner">
        <div
          className={`absolute top-1 left-1 w-1/2 h-10 bg-blue-600 rounded-full shadow-md transform transition-transform duration-300 ${
            activeTab === "precepts" ? "translate-x-full" : ""
          }`}
        ></div>

        <button
          className={`relative flex-1 py-2 flex items-center justify-center rounded-full font-semibold text-md transition-all duration-300 ${
            activeTab === "sufi" ? "text-white" : "text-gray-700 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("sufi")}
        >
          Sufi Corner
        </button>
        <button
          className={`relative flex-1 py-2 flex items-center justify-center rounded-full font-semibold text-md transition-all duration-300 ${
            activeTab === "precepts"
              ? "text-white"
              : "text-gray-700 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("precepts")}
        >
          Precepts of Spirituality
        </button>
      </div>

      {/* Content section toggles */}
      {activeTab === "sufi" && (
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <div className="mb-4">
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              value={sufiData.title}
              onChange={(e) => handleSufiChange("title", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Content</label>
            <textarea
              rows="6"
              value={sufiData.content}
              onChange={(e) => handleSufiChange("content", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            ></textarea>
          </div>
        </div>
      )}

      {activeTab === "precepts" && (
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <div className="mb-4">
            <label className="block font-medium mb-1">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          {preceptsImage && (
            <div className="mt-4">
              <img
                src={preceptsImage}
                alt="Precepts Preview"
                className="w-[200px] h-[200px] object-cover rounded border"
              />
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 block mx-auto ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default AdminSufiCorner;
