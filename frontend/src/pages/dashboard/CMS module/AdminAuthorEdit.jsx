import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

// Helper to set nested value based on dot notation (e.g. "aboutAuthor.leftText.heading")
const setNestedValue = (obj, path, value) => {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const nested = keys.reduce((acc, key) => acc[key], obj);
  nested[lastKey] = value;
  return { ...obj };
};

const AdminAuthorEdit = () => {
  const [form, setForm] = useState(null);

  const [motifFile, setMotifFile] = useState(null);
  const [motifPreview, setMotifPreview] = useState(null);

  const [rightFile, setRightFile] = useState(null);
  const [rightPreview, setRightPreview] = useState(null);

  const [leftFile, setLeftFile] = useState(null);
  const [leftPreview, setLeftPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/author");
        if (!res.ok) {
          console.warn("GET /api/author returned", res.status);
          return;
        }
        const data = await res.json();
        setForm(data);

        if (data.sectionHeading?.motifImage?.src)
          setMotifPreview(data.sectionHeading.motifImage.src);
        if (data.aboutAuthor?.rightImage?.src)
          setRightPreview(data.aboutAuthor.rightImage.src);
        if (data.workingCreed?.leftImage?.src)
          setLeftPreview(data.workingCreed.leftImage.src);
      } catch (err) {
        console.error("Failed to load author data", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => setNestedValue({ ...prevForm }, name, value));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    switch (type) {
      case "motif":
        setMotifFile(file);
        setMotifPreview(URL.createObjectURL(file));
        break;
      case "right":
        setRightFile(file);
        setRightPreview(URL.createObjectURL(file));
        break;
      case "left":
        setLeftFile(file);
        setLeftPreview(URL.createObjectURL(file));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(form));

      if (motifFile) formData.append("motifImage", motifFile);
      if (rightFile) formData.append("rightImage", rightFile);
      if (leftFile) formData.append("leftImage", leftFile);

      const res = await fetch("http://localhost:5000/api/author", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update author content");

      Swal.fire("Success", "Author content updated successfully!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update author content", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="text-center mt-10">Loading...</div>;

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
            Edit Author Content
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- TEXT CONTENT FIELDS (TOP) --- */}

          {/* Section Heading */}
          <div>
            <label className="block mb-1 font-medium">Section Heading</label>
            <input
              type="text"
              name="sectionHeading.text"
              value={form.sectionHeading.text}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* About Author Heading */}
          <div>
            <label className="block mb-1 font-medium">About Author Heading</label>
            <input
              type="text"
              name="aboutAuthor.leftText.heading"
              value={form.aboutAuthor.leftText.heading}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* About Author Paragraphs */}
          <div>
            <label className="block mb-1 font-medium">About Author Paragraphs</label>
            {form.aboutAuthor.leftText.paragraphs.map((para, index) => (
              <textarea
                key={index}
                name={`aboutAuthor.leftText.paragraphs.${index}.text`}
                value={para.text}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mb-2"
              />
            ))}
          </div>

          {/* Working Creed Heading */}
          <div>
            <label className="block mb-1 font-medium">Working Creed Heading</label>
            <input
              type="text"
              name="workingCreed.rightText.heading"
              value={form.workingCreed.rightText.heading}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Working Creed Paragraphs */}
          <div>
            <label className="block mb-1 font-medium">Working Creed Paragraphs</label>
            {form.workingCreed.rightText.paragraphs.map((para, index) => (
              <textarea
                key={index}
                name={`workingCreed.rightText.paragraphs.${index}.text`}
                value={para.text}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mb-2"
              />
            ))}
          </div>

          {/* Working Creed Link */}
          {/* <div>
            <label className="block mb-1 font-medium">Working Creed Link</label>
            <input
              type="text"
              name="workingCreed.rightText.link.to"
              value={form.workingCreed.rightText.link.to}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div> */}

{/* --- IMAGE UPLOAD FIELDS IN A SINGLE HORIZONTAL LINE --- */}
<div className="flex gap-8 mt-8 justify-center">
  {/* Motif Image */}
  {/* <div className="flex flex-col items-center">
    <label className="block mb-1 font-medium text-center">Motif Image</label>
    <input
      id="motifFileInput"
      type="file"
      accept="image/*"
      onChange={(e) => handleFileChange(e, "motif")}
      className="hidden"
    />
    <label
      htmlFor="motifFileInput"
      className="inline-block cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Choose Image
    </label>
    {motifPreview ? (
      <img
        src={motifPreview}
        alt="Motif Preview"
        className="w-[150px] h-[150px] mt-2 object-contain border rounded"
      />
    ) : (
      <p className="mt-2 text-gray-500 italic text-center w-[150px]">No image selected</p>
    )}
  </div> */}

  {/* Right Image */}
  <div className="flex flex-col items-center">
    <label className="block mb-1 font-medium text-center">Right Image (About Author)</label>
    <input
      id="rightFileInput"
      type="file"
      accept="image/*"
      onChange={(e) => handleFileChange(e, "right")}
      className="hidden"
    />
    <label
      htmlFor="rightFileInput"
      className="inline-block cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Choose Image
    </label>
    {rightPreview ? (
      <img
        src={rightPreview}
        alt="Right Image Preview"
        className="w-[150px] h-[150px] mt-2 object-contain border rounded"
      />
    ) : (
      <p className="mt-2 text-gray-500 italic text-center w-[150px]">No image selected</p>
    )}
  </div>

  {/* Left Image */}
  <div className="flex flex-col items-center">
    <label className="block mb-1 font-medium text-center">Left Image (Working Creed)</label>
    <input
      id="leftFileInput"
      type="file"
      accept="image/*"
      onChange={(e) => handleFileChange(e, "left")}
      className="hidden"
    />
    <label
      htmlFor="leftFileInput"
      className="inline-block cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Choose Image
    </label>
    {leftPreview ? (
      <img
        src={leftPreview}
        alt="Left Image Preview"
        className="w-[150px] h-[150px] mt-2 object-contain border rounded"
      />
    ) : (
      <p className="mt-2 text-gray-500 italic text-center w-[150px]">No image selected</p>
    )}
  </div>
</div>


          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`py-2 mt-4 bg-blue-700 hover:bg-blue-800 transition text-white font-regular px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update Author Content"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuthorEdit;
