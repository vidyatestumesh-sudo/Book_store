import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
  const itemsPerPage = 2;
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - itemsPerPage;
      return newIndex < 0 ? (totalPages - 1) * itemsPerPage : newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + itemsPerPage;
      return newIndex >= feedbacks.length ? 0 : newIndex;
    });
  };

  const currentPage = Math.floor(currentIndex / itemsPerPage) + 1;

  return (
    <div className="bg-white font-playfair mt-0 mb-6">
      <div className="w-full max-w-8xl mx-auto px-4 pb-5">
        {/* Heading */}
        <div className="relative mb-12 inline-block text-left">
          <h2 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mb-2 mt-0">
            Readers Feedback
          </h2>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-14 sm:w-16 md:w-20 lg:w-24 h-auto opacity-15"
          />
        </div>

        {/* Feedback Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-32 text-left mt-0 gap-10">
          {feedbacks.slice(currentIndex, currentIndex + itemsPerPage).map((fb) => (
            <div key={fb.id} className="space-y-4">
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 overflow-hidden rounded-full bg-[#993333] text-white flex items-center justify-center ">
                  <img
                    src="/readers.webp"
                    alt={fb.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="italic text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[24px] font-Figtree font-regular leading-snug leading-tight text-black-900 font-figtree break-words">
                  {fb.name}
                </span>
              </div>

              {/* Feedback Text */}
              <p className="text-left text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] xl:text-[21px] text-black-800 font-Figtree font-regular leading-tight lg:leading-[1.3]">{fb.text}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-12 flex items-center justify-center sm:justify-start gap-4 font-figtree text-black-800 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-snug lg:leading-normal">
          <button
            onClick={handlePrev}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-black text-black hover:bg-[#8c2f24] hover:text-[#e6e8da]"
          >
            <FiChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-black text-black hover:bg-[#8c2f24] hover:text-[#e6e8da] transition-colors"
          >
            <FiChevronRight size={20} />
          </button>

          <span className="text-gray-700 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[21px] xl:text-[22px] font-Figtree font-regular leading-snug leading-tigh font-figtree">
            {String(currentPage).padStart(2, "0")} /{" "}
            {String(totalPages).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReadersFeedback;
