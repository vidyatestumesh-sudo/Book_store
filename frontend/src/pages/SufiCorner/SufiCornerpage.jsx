import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

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
  const [corners, setCorners] = useState([]);
  const [precepts, setPrecepts] = useState([]);
  const [sufiSlides, setSufiSlides] = useState([]);
  const [posIndex, setPosIndex] = useState(0);
  const [precIndex, setPrecIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const width = useWindowWidth();

useEffect(() => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchCorners = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/home/corners`);
      if (!res.ok) throw new Error("Failed to fetch corners");
      const data = await res.json();

      setCorners(data);
      const sufiCorner = data.find(c => c.title === "The Sufi Corner");
      if (sufiCorner && Array.isArray(sufiCorner.slides)) {
        setSufiSlides(sufiCorner.slides);
      } else {
        setSufiSlides([]);
      }
    } catch (error) {
      console.error("Fetch corners failed:", error);
    }
  };

  const fetchPrecepts = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/precepts`);
      if (!res.ok) throw new Error("Failed to fetch precepts");
      const data = await res.json();
      setPrecepts(data);
    } catch (error) {
      console.error("Fetch precepts failed:", error);
    }
  };

  fetchCorners();
  fetchPrecepts();
}, []);


  // Sufi Corner carousel logic
  const sufiSlidesToShow = width < 1024 ? 1 : 2;
  const handlePosChange = (dir) => {
    setDirection(dir);
    setPosIndex((prev) => (prev + dir + sufiSlides.length) % sufiSlides.length);
  };
  const getPosSlides = () => {
    const slides = [];
    for (let i = 0; i < sufiSlidesToShow; i++) {
      slides.push(sufiSlides[(posIndex + i) % sufiSlides.length]);
    }
    return slides;
  };

  // Precepts carousel logic
  const slidesToShow = width < 640 ? 1 : width < 1024 ? 2 : 3;
  const handlePrecChange = (dir) => {
    setDirection(dir);
    setPrecIndex((prev) => (prev + dir + precepts.length) % precepts.length);
  };

  // Animation variants for Sufi Corner
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
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

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 justify-center items-start w-full">
            {getPosSlides().map((slide, idx) => {
              if (!slide || !slide.image) return null;
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
                      <div className="w-full max-w-[700px] h-[300px] sm:h-[350px] md:h-[390px] lg:h-[460px] overflow-hidden rounded-md p-4 relative">
                        <motion.img
                          key={slide.image}
                          src={slide.image}
                          alt="slide"
                          className="w-full h-full object-cover block"
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          loading="lazy"
                        />
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
              {String(posIndex + 1).padStart(2, "0")} / {String(sufiSlides.length).padStart(2, "0")}
            </span>
          </div>
        </section>

        {/* ===================== SECTION 2 : PRECEPTS ===================== */}
        <section className="py-14 w-full">
          <div className="relative inline-block mb-8">
            <h2 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mb-4">
              Precepts of Spirituality
            </h2>
            <img
              src="/motif.webp"
              alt="feather"
              className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2 pointer-events-none"
            />
          </div>

          <div className="overflow-hidden w-full">
            <motion.div
              className="flex gap-6 sm:gap-8"
              animate={{ x: -precIndex * (100 / slidesToShow) + "%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {[...precepts, ...precepts].map((slide, idx) => (
                <div
                  key={idx}
                  className="rounded-lg shadow-md overflow-hidden relative w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[360px] flex-shrink-0"
                  style={{ width: `${94 / slidesToShow}%` }}
                >
                  <img
                    src={slide.imageUrl}
                    alt="Precept"
                    className="w-full h-full object-cover absolute inset-0"
                    loading="lazy"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-12 flex items-center justify-center sm:justify-start gap-4 font-figtree text-black text-[16px] sm:text-[18px]">
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
              {String(precIndex + 1).padStart(2, "0")} / {String(precepts.length).padStart(2, "0")}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SufiCornerpage;
