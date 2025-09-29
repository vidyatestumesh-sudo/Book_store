import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import html2canvas from "html2canvas";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined"; // Assuming you're using MUI icons

const Corners = () => {
  const [corners, setCorners] = useState([]);
  const [slideIndexes, setSlideIndexes] = useState([]);
  const cardRefs = useRef({}); // Hold refs to each visible slide
  const bottomControlsRefs = useRef({}); // Hold refs to bottom controls for each slide

  useEffect(() => {
    const fetchCorners = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/home/corners`);
        if (!res.ok) throw new Error("Failed to fetch corners");
        const data = await res.json();

        const params = new URLSearchParams(window.location.search);
        const cornerParam = parseInt(params.get("corner"));
        const slideParam = parseInt(params.get("slide"));

        const initialIndexes = data.map(() => 0);
        if (
          !isNaN(cornerParam) &&
          !isNaN(slideParam) &&
          data[cornerParam]?.slides?.[slideParam]
        ) {
          initialIndexes[cornerParam] = slideParam;
        }

        setCorners(data);
        setSlideIndexes(initialIndexes);
      } catch (err) {
        console.error("Error fetching corners:", err);
      }
    };
    fetchCorners();
  }, []);

  const handleSlideChange = (cornerIndex, direction) => {
    setSlideIndexes((prev) => {
      const newIdxs = [...prev];
      const count = corners[cornerIndex]?.slides?.length || 1;
      newIdxs[cornerIndex] = (newIdxs[cornerIndex] + direction + count) % count;
      return newIdxs;
    });
  };

  const handleShare = async (cornerId, cornerIndex, slideIndex) => {
    const cardKey = `${cornerId}-${slideIndex}`;
    const cardNode = cardRefs.current[cardKey];
    const controlsNode = bottomControlsRefs.current[cardKey];

    if (!cardNode) return;

    try {
      // Hide bottom controls before capturing
      if (controlsNode) {
        controlsNode.style.display = "none";
      }

      const canvas = await html2canvas(cardNode, {
        useCORS: true,
        scale: 2,
      });

      // Show controls again after capture
      if (controlsNode) {
        controlsNode.style.display = "";
      }

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      const file = new File([blob], `slide-${cornerId}-${slideIndex}.png`, {
        type: "image/png",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Check out this slide",
          text: "Here's a slide I wanted to share with you.",
        });
      } else {
        // Fallback: download the image
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `slide-${cornerId}-${slideIndex}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert("Image downloaded. Sharing not supported on this device.");
      }
    } catch (error) {
      // Ensure controls are visible if error occurs
      if (controlsNode) {
        controlsNode.style.display = "";
      }
      console.error("Error sharing slide:", error);
      alert("Something went wrong while sharing.");
    }
  };

  return (
    <section className="bg-white py-12 px-0 font-figtree font-light">
      <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[50px]">
        {corners.map((corner, index) => {
          const slideIndex = slideIndexes[index] || 0;
          const slide = corner.slides[slideIndex];
          const cardKey = `${corner.id}-${slideIndex}`;

          return (
            <div key={corner.id} className="relative pt-14">
              {/* Top Dot + Chevron */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
                <div className="w-4 h-4 bg-[#d5a56f] rounded-full z-20"></div>
                <svg
                  viewBox="0 0 100 50"
                  className="w-15 h-14 -mt-1 z-10"
                  preserveAspectRatio="none"
                  aria-hidden="true">
                  <line
                    x1="50"
                    y1="0"
                    x2="5"
                    y2="55"
                    stroke="#d5a56f"
                    strokeWidth="3"
                  />
                  <line
                    x1="50"
                    y1="0"
                    x2="95"
                    y2="55"
                    stroke="#d5a56f"
                    strokeWidth="3"
                  />
                </svg>
              </div>

              {/* Card */}
              <div className="px-4 sm:px-8">
                <div
                  ref={(el) => (cardRefs.current[cardKey] = el)}
                  className="rounded-lg shadow-md text-white overflow-hidden w-full max-w-[600px] h-[700px] sm:h-[750px] mx-auto flex flex-col justify-between"
                  style={{ backgroundColor: corner.bgColor }}>
                  <div className="flex-1 flex flex-col px-6 pt-8 pb-4 gap-6">
                    <div className="relative text-center">
                      <h3 className="relative z-10 text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light leading-tight mt-3 mb-3">
                        {corner.title}
                      </h3>
                      <img
                        src="/motif.webp"
                        alt="Decorative motif"
                        className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2 pointer-events-none select-none"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="w-full flex justify-center px-4">
                      <div className="w-[520px] h-[285px] max-w-full sm:w-[550px] sm:h-[285px] h-[240px] flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={cardKey}
                            src={slide.image}
                            alt={`${corner.title} slide image`}
                            className="w-[520px] sm:h-[285px] sm:w-[550px] h-[240px] object-cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            loading="lazy"
                          />
                        </AnimatePresence>
                      </div>
                    </div>

                    <div>
                      <p className="text-[16px] sm:text-[18px] md:text-[18px] lg:text-[20px] text-black-800 font-Figtree font-regular text-center leading-relaxed mx-4">
                        {slide.text}
                      </p>
                      {slide.author && (
                        <p className="mt-4 italic text-right text-[16px] sm:text-[18px] text-black-800 font-light px-5">
                          – {slide.author}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Controls */}
                  <div
                    className="px-5 pb-[20px] flex items-center justify-between mt-auto"
                    ref={(el) => (bottomControlsRefs.current[cardKey] = el)}>
                    <div className="flex items-center gap-4">
                      <div className="share">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleShare(corner.id, index, slideIndex);
                          }}
                          style={{
                            color: "white",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                          aria-label={`Share slide ${slideIndex + 1} of ${
                            corner.title
                          }`}>
                          <ShareOutlinedIcon
                            className="share-icon"
                            style={{ color: "white" }}
                          />
                        </a>
                      </div>
                      {corner.readMoreUrl && (
                        <a
                          href={corner.readMoreUrl}
                          className="inline-flex items-center gap-1 !no-underline text-white text-[16px] hover:underline group"
                          target="_blank"
                          rel="noopener noreferrer">
                          <span>Read More</span>
                          <ArrowRight size={20} />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-6">
                      <button
                        aria-label={`Previous slide in ${corner.title}`}
                        onClick={() => handleSlideChange(index, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-white hover:bg-white hover:text-[#8c2f24] transition">
                        <FiChevronLeft size={20} />
                      </button>
                      <button
                        aria-label={`Next slide in ${corner.title}`}
                        onClick={() => handleSlideChange(index, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-white hover:bg-white hover:text-[#8c2f24] transition">
                        <FiChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Corners;
