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
  // ➝ Add more feedback here
];

const ReadersFeedback = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 2);
  };

  const handleNext = () => {
    if (currentIndex + 2 < feedbacks.length) setCurrentIndex(currentIndex + 2);
  };

  return (
    <div className="bg-white py-16 font-serif">
      <div className="w-full max-w-6xl mx-auto px-6 text-center">
        {/* Heading */}
        <div className="relative mb-12 inline-block">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Readers Feedback
          </h2>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute w-10 -top-6 left-1/2 transform -translate-x-1/2"
          />
        </div>

     {/* Feedback Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
  {feedbacks.slice(currentIndex, currentIndex + 2).map((fb) => (
    <div key={fb.id} className="space-y-4">
      {/* Avatar + Name */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-700  bg-red-700 flex-shrink-0">
          <img
            src="/readers.webp"
            alt={fb.name}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="italic font-medium text-gray-900">
          {fb.name}
        </span>
      </div>

      {/* Feedback Text */}
      <p className="text-gray-700 leading-relaxed">{fb.text}</p>
    </div>
  ))}
</div>


        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-400 text-gray-700 disabled:opacity-30"
          >
            <FiChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex + 2 >= feedbacks.length}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-400 text-gray-700 disabled:opacity-30"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadersFeedback;
