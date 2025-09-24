import React, { useEffect, useState } from "react";
import LaunchIcon from "@mui/icons-material/Launch";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LinkIcon from "@mui/icons-material/Link";

const BACKEND_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://bookstore-backend-hshq.onrender.com";

const LetterFromLangshott = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null); // track which letter was copied

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/letters`);
        const data = await response.json();
        const lettersData = Array.isArray(data) ? data : [];
        const activeLetters = lettersData.filter((letter) => !letter.suspended);
        setLetters(activeLetters);
      } catch (error) {
        console.error("Failed to fetch letters:", error);
        setLetters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLetters();
  }, []);

  const handleCopyLink = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);

      // Reset after 2s
      setTimeout(() => setCopiedId(null), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-8xl mx-auto py-0 text-center flex flex-col justify-center items-center mb-20">
        {/* Breadcrumb */}
        <div className="breadcrumb-container w-full text-left mb-0 font-figtree font-lite">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb m-0 p-0 flex flex-wrap gap-2 text-sm sm:text-base">
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
        <div className="relative inline-block">
          <h1 className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[50px] font-playfair font-light text-black leading-snug mb-4 mt-4">
            Letters from Langshott
          </h1>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 lg:w-32 h-auto mb-2 opacity-15"
          />
        </div>

        {/* Letters Grid */}
        <div className="max-w-8xl mx-auto min-h-screen mt-10 w-full">
          {letters.length === 0 ? (
            <p className="italic text-gray-500 text-center">
              No active letters available.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 h-[280px] sm:h-[300px] md:h-[340px] lg:h-[380px]">
              {letters.map(
                ({ _id, title, uploadedAt, fileUrl, downloadUrl, fileName }) => {
                  const downloadFileName = fileName?.toLowerCase().endsWith(".pdf")
                    ? fileName
                    : `${fileName || "download"}.pdf`;

                  return (
                    <div
                      key={_id}
                      className="bg-white border border-gray-300 rounded-lg p-2 flex flex-col w-full transition duration-300 transform hover:scale-[1.02]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-[110px] h-[155px] bg-gray-100 border border-gray-200 rounded overflow-hidden flex-shrink-0">
                          <img
                            src="/letters.png"
                            alt="PDF Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col items-start">
                          {/* Title & Date */}
                          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 break-words overflow-hidden line-clamp-2 text-left">
                            {title}
                          </h3>
                          <p className="text-xs sm:text-sm lg:text-sm text-gray-500 mb-2">
                            ({_id.slice(0, 2)} –{" "}
                            {new Date(uploadedAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })})
                          </p>

                          {/* Buttons */}
                          <div className="flex justify-start gap-3 mt-3 flex-wrap">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center no-underline text-gray-700 hover:text-blue-600 text-[10px] sm:text-xs md:text-sm"
                            >
                              <LaunchIcon className="sm:!text-[16px] md:!text-[18px] mb-1" style={{ fontSize: 14 }} />
                              Open
                            </a>

                            <a
                              href={downloadUrl}
                              download={downloadFileName}
                              className="flex flex-col items-center no-underline text-gray-700 hover:text-green-600 text-[10px] sm:text-xs md:text-sm"
                            >
                              <DownloadOutlinedIcon className="sm:!text-[16px] md:!text-[18px] mb-1" style={{ fontSize: 14 }} />
                              Download
                            </a>

                            <button
                              onClick={() => handleCopyLink(fileUrl, _id)}
                              className={`flex flex-col items-center no-underline ${copiedId === _id ? "text-green-600" : "text-gray-700 hover:text-gray-900"
                                } text-[10px] sm:text-xs md:text-sm`}
                            >
                              <LinkIcon
                                className="sm:!text-[16px] md:!text-[18px] mb-1"
                                style={{ fontSize: 14 }}
                              />
                              {copiedId === _id ? "Copied!" : "Copy Link"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LetterFromLangshott;
