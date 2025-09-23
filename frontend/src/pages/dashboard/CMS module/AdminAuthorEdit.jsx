import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";

const AdminAuthorEdit = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Fetch existing content on mount
  useEffect(() => {
    axiosClient.get("/author")
      .then(res => {
        setContent(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load author content.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!content) return <p>No content found.</p>;

  // Handle input change for nested fields
  const handleChange = (path, value) => {
    // Helper function to update nested state by path string, e.g., 'aboutAuthor.leftText.heading'
    setContent(prev => {
      const updated = { ...prev };
      const keys = path.split(".");
      let cur = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  // Handle paragraph text change
  const handleParagraphChange = (sectionPath, index, value) => {
    setContent(prev => {
      const updated = { ...prev };
      const keys = sectionPath.split(".");
      let cur = updated;
      for (let i = 0; i < keys.length; i++) {
        cur[keys[i]] = Array.isArray(cur[keys[i]]) ? [...cur[keys[i]]] : { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[index] = { ...cur[index], text: value };
      return updated;
    });
  };

  // Save updated content to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await axiosClient.put("/author", content);
      setSuccessMsg("Content updated successfully!");
    } catch (err) {
      setError("Failed to save content.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-Figtree space-y-6">
      <h1 className="text-3xl font-bold mb-6">Admin - Edit Author Content</h1>

      {error && <p className="text-red-600">{error}</p>}
      {successMsg && <p className="text-green-600">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Section Heading */}
        <fieldset>
          <legend className="font-semibold mb-2">Section Heading</legend>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={content.sectionHeading?.text || ""}
            onChange={(e) => handleChange("sectionHeading.text", e.target.value)}
            placeholder="Heading Text"
          />
          <input
            type="text"
            className="w-full p-2 border rounded mt-2"
            value={content.sectionHeading?.motifImage?.src || ""}
            onChange={(e) => handleChange("sectionHeading.motifImage.src", e.target.value)}
            placeholder="Motif Image URL"
          />
          <input
            type="text"
            className="w-full p-2 border rounded mt-2"
            value={content.sectionHeading?.motifImage?.alt || ""}
            onChange={(e) => handleChange("sectionHeading.motifImage.alt", e.target.value)}
            placeholder="Motif Image Alt Text"
          />
        </fieldset>

        {/* About Author - Left Text */}
        <fieldset>
          <legend className="font-semibold mb-2">About Author - Left Text</legend>
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            value={content.aboutAuthor?.leftText?.heading || ""}
            onChange={(e) => handleChange("aboutAuthor.leftText.heading", e.target.value)}
            placeholder="Left Text Heading"
          />
          {content.aboutAuthor?.leftText?.paragraphs?.map((para, idx) => (
            <textarea
              key={idx}
              rows={3}
              className="w-full p-2 border rounded mb-2"
              value={para.text}
              onChange={(e) => handleParagraphChange("aboutAuthor.leftText.paragraphs", idx, e.target.value)}
              placeholder={`Paragraph ${idx + 1}`}
            />
          ))}
        </fieldset>

        {/* About Author - Right Image */}
        <fieldset>
          <legend className="font-semibold mb-2">About Author - Right Image</legend>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={content.aboutAuthor?.rightImage?.src || ""}
            onChange={(e) => handleChange("aboutAuthor.rightImage.src", e.target.value)}
            placeholder="Right Image URL"
          />
          <input
            type="text"
            className="w-full p-2 border rounded mt-2"
            value={content.aboutAuthor?.rightImage?.alt || ""}
            onChange={(e) => handleChange("aboutAuthor.rightImage.alt", e.target.value)}
            placeholder="Right Image Alt Text"
          />
        </fieldset>

        {/* Working Creed - Left Image */}
        <fieldset>
          <legend className="font-semibold mb-2">Working Creed - Left Image</legend>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={content.workingCreed?.leftImage?.src || ""}
            onChange={(e) => handleChange("workingCreed.leftImage.src", e.target.value)}
            placeholder="Left Image URL"
          />
          <input
            type="text"
            className="w-full p-2 border rounded mt-2"
            value={content.workingCreed?.leftImage?.alt || ""}
            onChange={(e) => handleChange("workingCreed.leftImage.alt", e.target.value)}
            placeholder="Left Image Alt Text"
          />
        </fieldset>

        {/* Working Creed - Right Text */}
        <fieldset>
          <legend className="font-semibold mb-2">Working Creed - Right Text</legend>
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            value={content.workingCreed?.rightText?.heading || ""}
            onChange={(e) => handleChange("workingCreed.rightText.heading", e.target.value)}
            placeholder="Right Text Heading"
          />
          {content.workingCreed?.rightText?.paragraphs?.map((para, idx) => (
            <textarea
              key={idx}
              rows={3}
              className="w-full p-2 border rounded mb-2"
              value={para.text}
              onChange={(e) => handleParagraphChange("workingCreed.rightText.paragraphs", idx, e.target.value)}
              placeholder={`Paragraph ${idx + 1}`}
            />
          ))}

          {/* Link */}
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            value={content.workingCreed?.rightText?.link?.text || ""}
            onChange={(e) => handleChange("workingCreed.rightText.link.text", e.target.value)}
            placeholder="Link Text"
          />
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={content.workingCreed?.rightText?.link?.to || ""}
            onChange={(e) => handleChange("workingCreed.rightText.link.to", e.target.value)}
            placeholder="Link URL"
          />
        </fieldset>

        <button
          type="submit"
          className="bg-[#8c2f24] text-white px-6 py-2 rounded hover:bg-[#7a281f] transition-colors"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default AdminAuthorEdit;
