import React, { useState } from "react";

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
        image: "//langshott.org/wp-content/uploads/2025/02/2.png",
        text:
          "You Are A Microcosm Of The Universe.\nYou Will Live For As Long As The Universe Exists.",
      },
      {
        image: "//langshott.org/wp-content/uploads/2025/02/3.png",
        text:
          "It is human to have fear.\nBut have courage to stand atop your fear\nso cowards never see it.",
          author: "Anil Kumar",
      },
      {
        image: "//langshott.org/wp-content/uploads/2025/02/4.png",
        text:
          "Who forces time is pushed back by time;\nwho yields to time finds time on his side.",
          author: "The Talmud",
      },
      {
        image: "//langshott.org/wp-content/uploads/2025/02/5.png",
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
        image: "//langshott.org/wp-content/uploads/2024/09/Media.png",
        text:
          "One day you are the machine and I am the machinery, the next day I am the machine and you are the machinery.\nWe behave like conjoined twins.",
        author: "Anil Kumar",
      },
      {
        image: "//langshott.org/wp-content/uploads/2024/08/Media-4.jpeg",
        text: "Stop weaving and watch how the pattern improves.",
        author: "Rumi",
      },
      {
        image: "//langshott.org/wp-content/uploads/2024/07/big-Add-a-subheading.png",
        text: "In every religion there is love, and yet love has no religion.",
        author: "Rumi",
      },
      {
        image:
          "//langshott.org/wp-content/uploads/2024/01/161953452_1910493185772176_7479154913878273194_o.jpeg",
        text:
          "No matter what plans you make, no matter what you acquire, the thief will enter from the unguarded side. Be occupied then, with what you really value, and let the thief take something else.",
        author: "Rumi",
      },
    ],
    bgColor: "#8c2f24",
  },
];

const Corners = () => {
  const [slideIndexes, setSlideIndexes] = useState(
    corners.map(() => 0) // one index per corner
  );

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
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
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
              <div
                className="rounded-lg shadow-md text-white overflow-hidden h-[500px] flex flex-col justify-between"
                style={{ backgroundColor: corner.bgColor }}
              >
                <div className="px-6 py-8 flex flex-col h-full">
                  {/* Title */}
                  <h3 className="text-2xl font-semibold mb-4 text-center font-playfair">
                    {corner.title}
                    <span className="block w-full h-4 mt-1">
                      <img
                        src="motif.webp"
                        alt="decoration"
                        className="mx-auto opacity-20 w-6"
                      />
                    </span>
                  </h3>

                  {/* Image */}
                  <div className="w-full h-48 overflow-hidden px-5 rounded-md mb-4">
                    <img
                      src={slide.image}
                      alt={corner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Text */}
                  <p className="text-sm leading-relaxed italic whitespace-pre-line font-light text-center">
                    {slide.text}
                  </p>

                  {/* Author */}
                  {slide.author && (
                    <p className="mt-4 italic text-sm text-right font-light">
                      – {slide.author}
                    </p>
                  )}

                  {/* Bottom Controls */}
                  <div className="mt-auto pt-6 flex items-center px-2 justify-between">
                    {/* Read More only for Sufi */}
                    {corner.id === 2 ? (
                      <a
                        href="#"
                        className="inline-flex items-center gap-1 text-white hover:underline text-sm font-light"
                      >
                        Read More <span className="text-lg">→</span>
                      </a>
                    ) : (
                      <span></span>
                    )}

                    {/* Arrows always visible */}
                    <div
                      className={`flex gap-3 ${
                        corner.id === 1 ? "mx-auto" : ""
                      }`}
                    >
                      <button
                        onClick={() => handleSlideChange(index, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-white hover:bg-white hover:text-[#8c2f24] transition"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => handleSlideChange(index, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-white hover:bg-white hover:text-[#8c2f24] transition"
                      >
                        →
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
