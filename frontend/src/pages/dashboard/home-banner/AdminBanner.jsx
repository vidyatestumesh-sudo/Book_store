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

  const handleFileChange = (e, type) => {
    if (type === "logo") setLogoFile(e.target.files[0]);
    if (type === "authorImage") setAuthorImageFile(e.target.files[0]);
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

          {/* Stars Count, Logo, Author Image - Side by Side */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Stars Count */}
            <div className="flex-1">
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
              {bannerData.logoUrl && (
                <img
                  src={bannerData.logoUrl}
                  alt="Current Logo"
                  className="h-20 mt-2 object-contain"
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
              {bannerData.imageUrl && (
                <img
                  src={bannerData.imageUrl}
                  alt="Current Author"
                  className="h-20 mt-2 object-contain"
                />
              )}
            </div>
          </div>

          {/* Submit Button with Spinner */}
          <button
            type="submit"
            disabled={loading}
            className={`py-2 mt-4 bg-blue-700 hover:bg-blue-800 transition text-white font-bold px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
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
