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
    <div className="bg-[#e9e0d4] py-16 font-serif">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Title */}
        <div className="relative mb-12 inline-block">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Inspiration Board
          </h2>
          <img
            src="/motif.webp" // feather from assets
            alt="feather"
            className="absolute w-12 -top-8 left-1/2 transform -translate-x-1/2"
          />
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {inspirations.map((item) => (
            <div key={item.id} className="space-y-4 text-center">
              {/* Image + Date */}
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover rounded-md"
                />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-[#e9e0d4] px-3 py-1 text-sm font-medium rounded-t-lg">
                  {item.date}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-medium text-gray-900">
                {item.title}
              </h3>

              {/* Read More */}
              <button className="flex items-center gap-2 text-red-600 font-medium mx-auto">
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
