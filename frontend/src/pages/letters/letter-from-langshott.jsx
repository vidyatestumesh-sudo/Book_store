import React, { useEffect, useState } from "react";

const pdfIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="#cc6633"
    viewBox="0 0 24 24"
    className="mr-2 flex-shrink-0"
  >
    <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-1-15v6h2v-6h-2zm0 8v2h2v-2h-2z" />
  </svg>
);

const viewIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="#3366cc"
    viewBox="0 0 24 24"
    className="mr-2 flex-shrink-0"
  >
    <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
  </svg>
);

// Define backend base URL based on environment
const BACKEND_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://bookstore-backend-hshq.onrender.com";

const LetterFromLangshott = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/letters`);
        const data = await response.json();
        const lettersData = Array.isArray(data) ? data : [];
        setLetters(lettersData);
      } catch (error) {
        console.error("Failed to fetch letters:", error);
        setLetters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="max-w-8xl mx-auto py-0 text-center flex flex-col justify-center items-center px-4">
      <div className="breadcrumb-container w-full text-left mb-0 ml-10 font-figtree font-lite">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb m-0 p-0">
            <li className="breadcrumb-item">
              <a href="/" className="text-gray">
                Home
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="/publications" className="!text-gray-600">
                Letters from Langshott
              </a>
            </li>
          </ol>
        </nav>
      </div>

      {/* Title Section */}
      <div className="relative inline-block mb-8 pt-[50px]">
        <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair text-black font-display leading-snug">
          Letters from Langshott
        </h1>
        <img
          src="/motif.webp"
          alt="feather"
          className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-14 sm:w-16 md:w-20 lg:w-24 h-auto opacity-15"
          style={{ opacity: 0.15 }}
        />
      </div>

      {/* Letters List */}
      {letters.length === 0 ? (
        <p className="italic text-gray-500">No letters uploaded yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-[1200px]">
          {letters.map(({ _id, title, uploadedAt, fileUrl, downloadUrl, fileName }) => {
            const downloadFileName = fileName?.toLowerCase().endsWith(".pdf")
              ? fileName
              : `${fileName || "download"}.pdf`;

            return (
              <li
                key={_id}
                className="group bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg md:text-xl font-semibold font-figtree text-gray-800 mb-2 break-words">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Published: {new Date(uploadedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-center gap-4 mt-auto">
                  {/* View PDF - direct Google Drive viewUrl */}
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 text-[#3366cc] font-semibold hover:underline"
                    title="View PDF"
                  >
                    {viewIcon}
                    <span>View PDF</span>
                  </a>

                  {/* Download PDF - uses downloadUrl */}
                  <a
                    href={downloadUrl}
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 text-[#cc6633] font-semibold hover:underline"
                    title="Download PDF"
                    download={downloadFileName}
                  >
                    {pdfIcon}
                    <span>Download PDF</span>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LetterFromLangshott;
