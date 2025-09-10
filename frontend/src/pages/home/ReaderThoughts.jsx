import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const thoughts = [
  {
    id: 1,
    title: "T.E.M.P.L.E.",
    text: "It is a non-descript sanctuary of silence, presence and conscious growth where one communes with infinite, not through dogma, but through deep inner experience and unity."
  },
  {
    id: 2,
    title: "Mindful Grace",
    text: "I welcome the material world with mindful grace, knowing that true wealth is measured in intention. I walk in the world with spirit as my compass and abundance as my companion. All I receive, I elevate; all I give, I sanctify. In me, matter and spirit live as one."
  },
  {
    id: 3,
    title: "Inner Stillness",
    text: "Through stillness, clarity arises, and the noise of the world fades into silence, revealing truth."
  },
  {
    id: 4,
    title: "Gratitude Path",
    text: "Every step I take with gratitude opens doors to abundance and deeper connection with life."
  },
  // ➝ Add more until 15
];

const ReaderThoughts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 2);
  };

  const handleNext = () => {
    if (currentIndex + 2 < thoughts.length) setCurrentIndex(currentIndex + 2);
  };

  return (
    <div className="bg-[#f5f5eb] min-h-screen flex flex-col justify-center font-serif">
      {/* Content Wrapper */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 px-6">
        
        {/* Left Image */}
        <div className="flex justify-center">
          <img
            src="/reader_thoughts_img.png"
            alt="mind illustration"
            className="w-100 h-100 object-contain"
          />
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-center">
          {/* Heading */}
          <div className="relative mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
              What’s On My Mind?
            </h2>
            <img
              src="/feather.png"
              alt="feather"
              className="absolute w-10 -top-6 left-1/2 transform -translate-x-1/2 md:left-auto md:translate-x-0 md:-right-16"
            />
          </div>

          {/* Two Thoughts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {thoughts.slice(currentIndex, currentIndex + 2).map((thought) => (
              <div key={thought.id} className="space-y-4">
                <h3 className="text-2xl font-semibold text-red-700">
                  {String(thought.id).padStart(2, "0")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <span className="block font-bold mb-2">{thought.title}</span>
                  {thought.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-10">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-400 text-gray-700 disabled:opacity-30"
        >
          <FiChevronLeft size={20} />
        </button>

        {/* Counter */}
        <span className="text-gray-700 text-sm">
          {String(Math.ceil((currentIndex + 1) / 2)).padStart(2, "0")} /{" "}
          {String(Math.ceil(thoughts.length / 2)).padStart(2, "0")}
        </span>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={currentIndex + 2 >= thoughts.length}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-400 text-gray-700 disabled:opacity-30"
        >
          <FiChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ReaderThoughts;
