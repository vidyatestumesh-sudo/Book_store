import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminAuthorEdit = () => {
  const [authorData, setAuthorData] = useState(null);
  const [form, setForm] = useState({
    sectionHeading: { text: "" },
    aboutAuthor: {
      leftText: { heading: "", paragraphs: [{ text: "" }] },
      rightImage: { src: "", alt: "" },
    },
    workingCreed: {
      leftImage: { src: "", alt: "" },
      rightText: {
        heading: "",
        paragraphs: [{ text: "" }],
        link: { text: "", to: "" },
      },
    },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/api/author`);
        if (!res.ok) throw new Error("Failed to fetch author data");
        const data = await res.json();
        setAuthorData(data);
        setForm(data);
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to fetch author data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For nested properties, you may need a more complex handler or libraries like lodash set
    // For simplicity, this example only updates shallow properties
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Example for nested fields update (you will need to extend this for your nested form)
  const handleNestedChange = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}/api/author`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update author data");
      }

      const result = await res.json();
      setAuthorData(result);
      Swal.fire("Success", "Author content updated successfully", "success");
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to update author data", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !authorData) return <div>Loading author content...</div>;
  if (!authorData) return <div>No author content found.</div>;

  return (
    <div className="container mt-[100px] max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-3 py-1 shadow transition transform hover:scale-105"
      >
        <ArrowBackIcon className="w-4 h-4 mr-1" />
        Back
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">Edit Author Content</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Heading */}
        <div>
          <label className="block font-medium mb-1">Section Heading</label>
          <input
            type="text"
            name="sectionHeadingText"
            value={form.sectionHeading.text || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                sectionHeading: { ...prev.sectionHeading, text: e.target.value },
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* About Author - Left Text Heading */}
        <div>
          <label className="block font-medium mb-1">About Author - Left Text Heading</label>
          <input
            type="text"
            value={form.aboutAuthor.leftText.heading || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                aboutAuthor: {
                  ...prev.aboutAuthor,
                  leftText: { ...prev.aboutAuthor.leftText, heading: e.target.value },
                },
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* About Author - Left Text Paragraph (first one) */}
        <div>
          <label className="block font-medium mb-1">About Author - Paragraph</label>
          <textarea
            rows={4}
            value={(form.aboutAuthor.leftText.paragraphs?.[0]?.text) || ""}
            onChange={(e) => {
              const newParagraphs = [...(form.aboutAuthor.leftText.paragraphs || [])];
              newParagraphs[0] = { text: e.target.value };
              setForm((prev) => ({
                ...prev,
                aboutAuthor: {
                  ...prev.aboutAuthor,
                  leftText: { ...prev.aboutAuthor.leftText, paragraphs: newParagraphs },
                },
              }));
            }}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* About Author - Right Image URL */}
        <div>
          <label className="block font-medium mb-1">About Author - Right Image URL</label>
          <input
            type="text"
            value={form.aboutAuthor.rightImage.src || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                aboutAuthor: {
                  ...prev.aboutAuthor,
                  rightImage: { ...prev.aboutAuthor.rightImage, src: e.target.value },
                },
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* About Author - Right Image Alt */}
        <div>
          <label className="block font-medium mb-1">About Author - Right Image Alt</label>
          <input
            type="text"
            value={form.aboutAuthor.rightImage.alt || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                aboutAuthor: {
                  ...prev.aboutAuthor,
                  rightImage: { ...prev.aboutAuthor.rightImage, alt: e.target.value },
                },
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Working Creed - Left Image URL */}
        <div>
          <label className="block font-medium mb-1">Working Creed - Left Image URL</label>
          <input
            type="text"
            value={form.workingCreed.leftImage.src || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                workingCreed: {
                  ...prev.workingCreed,
                  leftImage: { ...prev.workingCreed.leftImage, src: e.target.value },
                },
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Working Creed - Left Image Alt */}
        <div>
          <label className="block font-medium mb-1">Working Creed - Left Image Alt</label>
          <input
            type="text"
            value={form.workingCreed.leftImage.alt || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                workingCreed: {
                  ...prev.workingCreed,
                  leftImage: { ...prev.workingCreed.leftImage, alt: e.target.value },
                },
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Working Creed - Right Text Heading */}
        <div>
          <label className="block font-medium mb-1">Working Creed - Right Text Heading</label>
          <input
            type="text"
            value={form.workingCreed.rightText.heading || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                workingCreed: {
                  ...prev.workingCreed,
                  rightText: { ...prev.workingCreed.rightText, heading: e.target.value },
                },
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Working Creed - Right Text Paragraph (first one) */}
        <div>
          <label className="block font-medium mb-1">Working Creed - Paragraph</label>
          <textarea
            rows={4}
            value={(form.workingCreed.rightText.paragraphs?.[0]?.text) || ""}
            onChange={(e) => {
              const newParagraphs = [...(form.workingCreed.rightText.paragraphs || [])];
              newParagraphs[0] = { text: e.target.value };
              setForm((prev) => ({
                ...prev,
                workingCreed: {
                  ...prev.workingCreed,
                  rightText: { ...prev.workingCreed.rightText, paragraphs: newParagraphs },
                },
              }));
            }}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Working Creed - Right Text Link Text */}
        <div>
          <label className="block font-medium mb-1">Working Creed - Link Text</label>
          <input
            type="text"
            value={form.workingCreed.rightText.link?.text || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                workingCreed: {
                  ...prev.workingCreed,
                  rightText: {
                    ...prev.workingCreed.rightText,
                    link: { ...prev.workingCreed.rightText.link, text: e.target.value },
                  },
                },
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Working Creed - Right Text Link To */}
        <div>
          <label className="block font-medium mb-1">Working Creed - Link To</label>
          <input
            type="text"
            value={form.workingCreed.rightText.link?.to || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                workingCreed: {
                  ...prev.workingCreed,
                  rightText: {
                    ...prev.workingCreed.rightText,
                    link: { ...prev.workingCreed.rightText.link, to: e.target.value },
                  },
                },
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Update Author Content"}
        </button>
      </form>
    </div>
  );
};

export default AdminAuthorEdit;
