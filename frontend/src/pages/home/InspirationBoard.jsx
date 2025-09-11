import React from "react";
import { FiArrowRight } from "react-icons/fi";

const inspirations = [
  {
    id: 1,
    title: "Leave the Mountain, Flow with the River",
    date: "June 9, 2025",
    image: "/leave-the-mountain.webp",
  },
  {
    id: 2,
    title: "Be the Open Sky, combat Suffering",
    date: "May 23, 2025",
    image: "/be-the-open-sky.webp",
  },
  {
    id: 3,
    title: "Here Love Is, There God Is Also – Mahatma Gandhi",
    date: "March 20, 2025",
    image: "/where-love-is.webp",
  },
];

const InspirationBoard = () => {
  return (
    // Full viewport width bg container
    <div className="w-full bg-[#e9e0d4] font-playfair text-gray-900">
      {/* Centered content container with max width 1920px */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 py-16 text-center">
        
        {/* Section Title */}
        <div className="relative inline-block mb-12">
          <h2 className="text-[32px] sm:text-[40px] md:text-[50px] font-display leading-snug mb-4">
            Inspiration Board
          </h2>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 md:w-28 h-auto opacity-15 pointer-events-none"
          />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {inspirations.map((item) => (
            <div key={item.id} className="space-y-4 text-center">
              {/* Image */}
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 md:h-64 object-cover rounded-md shadow-md"
                />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-[#e9e0d4] px-4 py-1 text-sm font-medium rounded-t-lg shadow-sm">
                  {item.date}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-medium text-gray-900 px-2">
                {item.title}
              </h3>

              {/* Read More */}
              <button className="flex items-center gap-2 text-red-600 font-medium mx-auto hover:underline transition">
                Read More <FiArrowRight />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InspirationBoard;
