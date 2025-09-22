import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdminBanner = () => {
  const [bannerData, setBannerData] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    quote: "",
    starsCount: 5,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [authorImageFile, setAuthorImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch current banner data
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch("/api/home/banner");
        const data = await res.json();
        setBannerData(data);
        setForm({
          title: data.title || "",
          description: data.description || "",
          quote: data.quote || "",
          starsCount: data.starsCount || 5,
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch banner data", "error");
      }
    };
    fetchBanner();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file change with dimension check
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      let requiredWidth, requiredHeight;

      if (type === "logo") {
        requiredWidth = 210;
        requiredHeight = 130;
      } else if (type === "authorImage") {
        requiredWidth = 740;
        requiredHeight = 710;
      }

      const withinRange =
        Math.abs(img.width - requiredWidth) <= 25 &&
        Math.abs(img.height - requiredHeight) <= 25;

      // Case 1: Exact (within ±25px) → auto accept
      if (withinRange) {
        saveFile(file, type);
        return;
      }

      // Case 2: Too small → ask admin
      if (img.width < requiredWidth || img.height < requiredHeight) {
        Swal.fire({
          icon: "warning",
          title: `${type === "logo" ? "Logo" : "Author Image"} Larger Than Recommended`,
          html: `
          <p>Recommended: <b>${requiredWidth} × ${requiredHeight}px</b></p>
          <p>You uploaded: <b>${img.width} × ${img.height}px</b></p>
          <p>Do you want to use this image anyway?</p>
        `,
          showCancelButton: true,
          confirmButtonText: "Yes, use it",
          cancelButtonText: "No, re-upload",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) saveFile(file, type);
          else e.target.value = "";
        });
        return;
      }

      // Case 3: Larger → ask admin
      if (img.width > requiredWidth || img.height > requiredHeight) {
        Swal.fire({
          icon: "warning",
          title: `${type === "logo" ? "Logo" : "Author Image"} Larger Than Recommended`,
          html: `
          <p>Recommended: <b>${requiredWidth} × ${requiredHeight}px</b></p>
          <p>You uploaded: <b>${img.width} × ${img.height}px</b></p>
          <p>Do you want to use this image anyway?</p>
        `,
          showCancelButton: true,
          confirmButtonText: "Yes, use it",
          cancelButtonText: "No, re-upload",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) saveFile(file, type);
          else e.target.value = "";
        });
        return;
      }
    };
  };

  // Helper: Save file + preview
  const saveFile = (file, type) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerData((prev) => ({
        ...prev,
        [type === "logo" ? "logoUrl" : "imageUrl"]: reader.result,
      }));
    };
    reader.readAsDataURL(file);

    if (type === "logo") setLogoFile(file);
    if (type === "authorImage") setAuthorImageFile(file);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("quote", form.quote);
      formData.append("starsCount", form.starsCount);

      if (logoFile) formData.append("logo", logoFile);
      if (authorImageFile) formData.append("image", authorImageFile);

      const res = await fetch(`/api/home/banner/${bannerData._id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Update failed");

      setBannerData(result.banner);

      // Success popup
      Swal.fire("Banner Updated", "Banner updated successfully!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to update banner", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!bannerData) return <div>Loading banner...</div>;

  return (
    <div className="container mt-[100px]">
      <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Edit Banner Content
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              rows={5}
            />
          </div>

          {/* Quote */}
          <div>
            <label className="block mb-1 font-medium">Quote</label>
            <input
              type="text"
              name="quote"
              value={form.quote}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Stars Count, Logo, Author Image - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stars Count */}
            <div>
              <label className="block mb-1 font-medium">Stars Count</label>
              <input
                type="number"
                name="starsCount"
                value={form.starsCount}
                onChange={handleChange}
                className="w-1/2 border px-3 py-2 rounded"
                min={1}
                max={50}
              />
            </div>

            {/* Logo */}
            <div className="flex-1">
              <label className="block mb-1 font-medium">Logo Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "logo")}
                className="block"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended size: <span className="font-semibold">210 × 130 px</span>
              </p>
              {bannerData.logoUrl && (
                <img
                  src={bannerData.logoUrl}
                  alt="Current Logo"
                  className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] mt-2 object-contain border rounded"
                />
              )}
            </div>

            {/* Author Image */}
            <div className="flex-1">
              <label className="block mb-1 font-medium">Author Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "authorImage")}
                className="block"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended size: <span className="font-semibold">740 × 710 px</span>
              </p>
              {bannerData.imageUrl && (
                <img
                  src={bannerData.imageUrl}
                  alt="Current Author"
                  className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] mt-2 object-contain border rounded"
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`py-2 mt-4 bg-blue-700 hover:bg-blue-800 transition text-white font-bold px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
                Updating...
              </>
            ) : (
              "Update Banner"
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminBanner;
