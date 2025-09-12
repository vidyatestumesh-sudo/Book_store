import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const corners = [
  {
    id: 1,
    title: "Positivity Corner",
    slides: [
      {
        image: "/positivity-corner-1.webp",
        text:
          "The individual who, having confronted the depths of wickedness within, silently commits to its eradication at its very source, initiales an unstoppable ripple effect that dismantles the darkness in countless others.",
      },
      {
        image: "https://langshott.org/wp-content/uploads/2025/02/2.png",
        text:
          "You Are A Microcosm Of The Universe.\nYou Will Live For As Long As The Universe Exists.",
      },
      {
        image: "https://langshott.org/wp-content/uploads/2025/02/3.png",
        text:
          "It is human to have fear.\nBut have courage to stand atop your fear\nso cowards never see it.",
        author: "Anil Kumar",
      },
      {
        image: "https://langshott.org/wp-content/uploads/2025/02/4.png",
        text:
          "Who forces time is pushed back by time;\nwho yields to time finds time on his side.",
        author: "The Talmud",
      },
      {
        image: "https://langshott.org/wp-content/uploads/2025/02/5.png",
        text:
          "You know you love someone when you know\nyou want them to be happy,\neven if their happiness means\nthat you are not a part of it.",
        author: "Anonymous",
      },
    ],
    bgColor: "#bc6430",
  },
  {
    id: 2,
    title: "The Sufi Corner",
    slides: [
      {
        image: "/the-sufi-corner-1.webp",
        text:
          "He that looks at a white wall and sees himself on it has reached the veil between form and formlessness, where the self dissolves into the divine mirror of existence.",
        author: "Anil Kumar",
      },
      {
        image: "https://langshott.org/wp-content/uploads/2024/09/Media.png",
        text:
          "One day you are the machine and I am the machinery, the next day I am the machine and you are the machinery.\nWe behave like conjoined twins.",
        author: "Anil Kumar",
      },
      {
        image: "https://langshott.org/wp-content/uploads/2024/08/Media-4.jpeg",
        text: "Stop weaving and watch how the pattern improves.",
        author: "Rumi",
      },
      {
        image: "https://langshott.org/wp-content/uploads/2024/07/big-Add-a-subheading.png",
        text: "In every religion there is love, and yet love has no religion.",
        author: "Rumi",
      },
      {
        image:
          "https://langshott.org/wp-content/uploads/2024/01/161953452_1910493185772176_7479154913878273194_o.jpeg",
        text:
          "No matter what plans you make, no matter what you acquire, the thief will enter from the unguarded side. Be occupied then, with what you really value, and let the thief take something else.",
        author: "Rumi",
      },
    ],
    bgColor: "#8c2f24",
    readMoreUrl: "/sufi-corner",
  },
];

const Corners = () => {
  const [slideIndexes, setSlideIndexes] = useState(corners.map(() => 0));

  const handleSlideChange = (cornerIndex, direction) => {
    setSlideIndexes((prev) => {
      const newIndexes = [...prev];
      const totalSlides = corners[cornerIndex].slides.length;
      newIndexes[cornerIndex] =
        (newIndexes[cornerIndex] + direction + totalSlides) % totalSlides;
      return newIndexes;
    });
  };

  return (
    <section className="bg-white py-16 px-6 font-figtree font-light">
      <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[60px]">
        {corners.map((corner, index) => {
          const slide = corner.slides[slideIndexes[index]];

          return (
            <div key={corner.id} className="relative pt-14">
              {/* Top Dot and Chevron */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
                <div className="w-4 h-4 bg-[#d5a56f] rounded-full z-20"></div>
                <svg
                  viewBox="0 0 100 50"
                  className="w-15 h-14 -mt-1 z-10"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <line
                    x1="50"
                    y1="0"
                    x2="5"
                    y2="60"
                    stroke="#d5a56f"
                    strokeWidth="4"
                  />
                  <line
                    x1="50"
                    y1="0"
                    x2="95"
                    y2="60"
                    stroke="#d5a56f"
                    strokeWidth="4"
                  />
                </svg>
              </div>

              {/* Card */}
              <div className="px-4 sm:px-8">
                <div
                  className="rounded-lg shadow-md text-white overflow-hidden w-full max-w-[600px] mx-auto flex flex-col justify-between"
                  style={{ backgroundColor: corner.bgColor }}
                >
                  {/* Card Content */}
                  <div className="flex-1 flex flex-col px-6 pt-8 pb-4 gap-6">
                    {/* Title */}
                    <div className="relative text-center">
                      <h3 className="relative z-10 font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-[50px] mt-3 mb-3">
                        {corner.title}
                      </h3>
                      <img
                        src="/motif.webp"
                        alt="Decorative motif"
                        className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-20 h-20 opacity-15 pointer-events-none select-none"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Image with adaptive size */}
                    <div className="w-full flex justify-center px-5">
                      <div className="w-[360px] h-[260px] flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={`${corner.id}-${slideIndexes[index]}`}
                            src={slide.image}
                            alt={`${corner.title} slide image`}
                            className="w-full h-full object-contain"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            loading="lazy"
                          />
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="text-[20px]">
                      <p className="text-[20px] leading-relaxed whitespace-pre-line font-light text-center m-2 mx-4">
                        {slide.text}
                      </p>
                      {slide.author && (
                        <p className="mt-4 italic text-right text-[20px] font-light px-5">
                          – {slide.author}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Controls */}
                  <div className="px-5 pb-[20px] flex items-center justify-between mt-auto">
                    {corner.readMoreUrl ? (
                      <a
                        href={corner.readMoreUrl}
                        className="inline-flex items-center gap-1 no-underline text-white text-[18px] font-light hover:underline"
                      >
                        Read More <span className="text-[18px]">→</span>
                      </a>
                    ) : (
                      <span></span>
                    )}

                    <div
                      className={`flex gap-3 ${
                        corner.id === 1 ? "mx-auto" : ""
                      }`}
                    >
                      <button
                        aria-label={`Previous slide in ${corner.title}`}
                        onClick={() => handleSlideChange(index, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-white hover:bg-white hover:text-[#8c2f24] transition"
                      >
                        <FiChevronLeft size={20} />
                      </button>
                      <button
                        aria-label={`Next slide in ${corner.title}`}
                        onClick={() => handleSlideChange(index, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-white hover:bg-white hover:text-[#8c2f24] transition"
                      >
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
