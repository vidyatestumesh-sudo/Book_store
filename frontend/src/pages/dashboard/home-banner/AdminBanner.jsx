import React, { useEffect, useState } from "react";

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
  const [message, setMessage] = useState(null);

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
        setMessage("Failed to fetch banner data.");
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
    setMessage(null);

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

      setMessage("Banner updated successfully!");
      setBannerData(result.banner); // assuming updated banner is returned
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!bannerData) return <div>Loading banner...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Edit Banner Content</h2>

      {message && (
        <div className="mb-4 text-sm text-blue-600 font-medium">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div>
          <label className="block mb-1 font-medium">Stars Count</label>
          <input
            type="number"
            name="starsCount"
            value={form.starsCount}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            min={1}
            max={50}
          />
        </div>

        {/* Logo Upload */}
        <div>
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
              className="h-20 mt-2"
            />
          )}
        </div>

        {/* Author Image Upload */}
        <div>
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
              className="h-28 mt-2"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Banner"}
        </button>
      </form>
    </div>
  );
};

export default AdminBanner;
