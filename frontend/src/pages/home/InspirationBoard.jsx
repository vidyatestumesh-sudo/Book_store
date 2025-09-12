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
    <div className="w-full bg-[#e9e0d4] font-playfair text-gray-900">
      <div className="w-full max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 py-16 text-center">
        {/* Section Title */}
        <div className="relative inline-block mb-12">
          <h2 className="text-[26px] sm:text-[36px] md:text-[50px] font-playfair text-black font-display leading-snug mb-4">
            Inspiration Board
          </h2>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-12 sm:w-16 md:w-20 lg:w-24 h-auto opacity-15 pointer-events-none mb-4"
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
                  className="w-full h-56 md:h-64 lg:h-72 xl:h-80 object-cover rounded-md"
                />
                <div className="absolute bottom-0 text-[20px] text-gray-500 left-1/2 transform -translate-x-1/2 bg-[#e9e0d4] px-4 py-1 font-figtree rounded-t-lg">
                  {item.date}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-[25px] font-medium text-black-700 px-2 font-figtree">
                {item.title}
              </h3>

              {/* Read More */}
              <button className="flex items-center gap-2 no-underline font- mx-auto transition font-figtree text-[18px]">
                <span className="text-black">Read More</span>
                <span className="text-[#8c2f24] ml-1 inline-block transform transition-transform duration-20 group-hover:translate-x-[18px]">
                  →</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InspirationBoard;
