import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaUserAlt } from "react-icons/fa";

const feedbacks = [
  {
    id: 1,
    name: "Nutan Yogi",
    text: "Every page was a breeze over every Hold. Every chapter was gentle and guided in gold & depth like the spread of autumn leaves. May these golden leaves fall over many many people & over the earth to emerge once more like the thousand Muscaris of glorious Spring. Well done."
  },
  {
    id: 2,
    name: "Kishore Patel, Boston, USA",
    text: "On daily basis, I read some of your thoughts & contemplate on them. It truly is a Gentle Breeze of Daily Wisdom. I am very grateful that you wrote this book. I will benefit a lot from it. It is very rewarding."
  },
  {
    id: 3,
    name: "Aarti Sharma, Delhi",
    text: "This book has become my morning ritual. It sets the tone for my day with positivity and mindfulness."
  },
  {
    id: 4,
    name: "John Doe, London",
    text: "Every reflection feels personal and deep. It’s a book that grows with you as you read it again and again."
  }
];

const ReadersFeedback = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 2);
  };

  const handleNext = () => {
    if (currentIndex + 2 < feedbacks.length) setCurrentIndex(currentIndex + 2);
  };

  const currentPage = Math.floor(currentIndex / 2) + 1;
  const totalPages = Math.ceil(feedbacks.length / 2);

  return (
    <div className="bg-white font-playfair relative min-h-[480px]">
      <div className="w-full max-w-7xl mx-auto px-6">
        {/* Heading - Top Left */}
        <div className="relative mb-12 inline-block text-left">
          <h2 className="text-[50px] font-playfair font-display leading-snug mb-5 mt-0">
            Readers Feedback
          </h2>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-25 h-28 md:w-28 md:h-22 [opacity:0.15] mb-0"
          />
        </div>

        {/* Feedback Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mt-0">
          {feedbacks.slice(currentIndex, currentIndex + 2).map((fb) => (
            <div key={fb.id} className="space-y-4">
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <div className="w-13 h-13 flex items-center justify-center bg-[#993333] rounded-full text-white">
                  <img src="/readers.webp" alt={fb.name} className="w-full h-full object-cover" />
                </div>
                <span className="italic text-xl font-bold text-gray-900 font-figtree break-words">
                  {fb.name}
                </span>
              </div>

              {/* Feedback Text */}
              <p className="font-figtree text-xl text-gray-700">{fb.text}</p>
            </div>
          ))}
        </div>

        {/* Controls fixed bottom-left */}
        <div className="absolute bottom-10 left-26 flex items-center gap-4 font-figtree">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-black text-black"
          >
            <FiChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex + 2 >= feedbacks.length}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-black text-black"
          >
            <FiChevronRight size={20} />
          </button>

          <span className="text-gray-700 font-medium select-none">
            {currentPage.toString().padStart(2, "0")} / {totalPages.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReadersFeedback;
