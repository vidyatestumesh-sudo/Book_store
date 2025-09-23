import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Slides for Top Section (Sufi Corner)
const SufiCorner = [
  { image: "/the-sufi-corner-1.webp" },
  { image: "https://langshott.org/wp-content/uploads/2024/09/Media.png" },
  { image: "https://langshott.org/wp-content/uploads/2024/08/Media-4.jpeg" },
  { image: "https://langshott.org/wp-content/uploads/2024/07/big-Add-a-subheading.png" },
  { image: "https://langshott.org/wp-content/uploads/2024/01/161953452_1910493185772176_7479154913878273194_o.jpeg" },
];

// Slides for Bottom Section (Precepts of Spirituality)
const preceptsSlides = [
  { image: "https://langshott.org/wp-content/uploads/2025/02/1.png" },
  { image: "https://langshott.org/wp-content/uploads/2025/02/2.png" },
  { image: "https://langshott.org/wp-content/uploads/2025/02/3.png" },
  { image: "https://langshott.org/wp-content/uploads/2025/02/4.png" },
  { image: "https://langshott.org/wp-content/uploads/2025/02/5.png" },
];

// Custom hook to get window width
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

const SufiCornerpage = () => {
  const [posIndex, setPosIndex] = useState(0);
  const [precIndex, setPrecIndex] = useState(0);
  const width = useWindowWidth();

  // Top section handlers
  const handlePosChange = (dir) => {
    setPosIndex((prev) => (prev + dir + SufiCorner.length) % SufiCorner.length);
  };

  const handlePrecChange = (dir) => {
    setPrecIndex((prev) => (prev + dir + preceptsSlides.length) % preceptsSlides.length);
  };

  const getPosSlides = () => {
    const secondIndex = (posIndex + 1) % SufiCorner.length;
    return [SufiCorner[posIndex], SufiCorner[secondIndex]];
  };

  // Determine how many slides to show in Precepts section
  const slidesToShow = width < 640 ? 1 : width < 1024 ? 2 : 3;

  const getVisiblePreceptsSlides = () => {
    const total = preceptsSlides.length;
    const slides = [];
    for (let i = 0; i < slidesToShow; i++) {
      slides.push(preceptsSlides[(precIndex + i) % total]);
    }
    return slides;
  };

  return (
    <div className="container">
      <div className="max-w-8xl mx-auto py-0 text-center flex flex-col justify-center items-center px-4">
        {/* Breadcrumbs */}
        <div className="breadcrumb-container w-full text-left mb-6 font-figtree font-light">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb m-0 p-0 flex gap-2 text-sm">
              <li>
                <a href="/" className="text-gray-500 hover:underline">Home</a>
              </li>
              <li>/</li>
              <li>
                <a href="/blogs" className="text-gray-500 hover:underline">Blogs</a>
              </li>
              <li>/</li>
              <li>
                <span className="text-gray-700">The Sufi Corner</span>
              </li>
            </ol>
          </nav>
        </div>

        {/* ===================== SECTION 1 : SUFI CORNER ===================== */}
        <section className="py-0 mb-0 w-full">
          <div className="relative inline-block mb-2">
            <h2 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mb-4">
              The Sufi Corner
            </h2>
            <img
              src="/motif.webp"
              alt="feather"
              className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2 pointer-events-none"
            />
          </div>

          <p className="text-[18px] sm:text-[20px] md:text-[24px] font-Figtree text-center font-playfair font-regular mb-10">
            Uplift your spirit
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center items-start w-full">
            {getPosSlides().map((slide, idx) => {
              const isLeft = idx === 0;
              const cardBg = isLeft ? "#bc6430" : "#8c2f24";
              const hangerColor = isLeft ? "#8c2f24" : "#bc6430";

              return (
                <div key={idx} className="relative pt-14">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full z-20" style={{ backgroundColor: hangerColor }}></div>
                    <svg viewBox="0 0 100 50" className="w-15 h-14 -mt-1 z-10" preserveAspectRatio="none" aria-hidden="true">
                      <line x1="50" y1="0" x2="5" y2="55" stroke={hangerColor} strokeWidth="3" />
                      <line x1="50" y1="0" x2="95" y2="55" stroke={hangerColor} strokeWidth="3" />
                    </svg>
                  </div>

                  <div
                    className="rounded-lg shadow-md text-white overflow-hidden w-full max-w-[700px] h-[300px] sm:h-[350px] md:h-[390px] lg:h-[460px] flex flex-col justify-between"
                    style={{ backgroundColor: cardBg }}
                  >
                    <div className="w-full flex justify-center">
                      <div className="w-full max-w-[700px] h-[300px] sm:h-[350px] md:h-[390px] lg:h-[460px] overflow-hidden rounded-md p-5">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={slide.image}
                            src={slide.image}
                            alt="slide"
                            className="w-full h-full object-cover block"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            loading="lazy"
                          />
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex items-center justify-center sm:justify-start gap-4 font-figtree text-black text-[16px] sm:text-[18px]">
            <button
              onClick={() => handlePosChange(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition"
            >
              <FiArrowLeft size={18} />
            </button>
            <button
              onClick={() => handlePosChange(1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition"
            >
              <FiArrowRight size={18} />
            </button>
            <span className="text-gray-700">
              {String(posIndex + 1).padStart(2, "0")} / {String(SufiCorner.length).padStart(2, "0")}
            </span>
          </div>
        </section>

        {/* ===================== SECTION 2 : PRECEPTS ===================== */}
        <section className="py-8 w-full bg-white">
          <div className="relative inline-block mb-6">
            <h2 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mb-4">
              Precepts of Spirituality
            </h2>
            <img
              src="/motif.webp"
              alt="feather"
              className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2 pointer-events-none"
            />
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 w-full px-2 sm:px-6 md:px-12 lg:px-20`}>
            {getVisiblePreceptsSlides().map((slide, idx) => (
              <div
                key={idx}
                className="rounded-lg shadow-md overflow-hidden relative w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[360px]"
              >
                <img
                  src={slide.image}
                  alt="Precept"
                  className="w-full h-full object-cover absolute inset-0"
                />
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center sm:justify-start gap-4 font-figtree text-black text-[16px] sm:text-[18px] px-4 sm:px-8 md:px-16 lg:px-24">
            <button
              onClick={() => handlePrecChange(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition"
            >
              <FiArrowLeft size={18} />
            </button>
            <button
              onClick={() => handlePrecChange(1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition"
            >
              <FiArrowRight size={18} />
            </button>
            <span className="text-gray-700">
              {String(precIndex + 1).padStart(2, "0")} / {String(preceptsSlides.length).padStart(2, "0")}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SufiCornerpage;
