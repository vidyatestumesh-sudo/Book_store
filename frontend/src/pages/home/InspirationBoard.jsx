import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { ArrowRight } from "lucide-react";

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
      <div className="w-full max-w-8xl mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 py-16 text-center">
        {/* Section Title */}
        <div className="relative inline-block mb-12">
          <h2 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mb-4">
            Inspiration Board
          </h2>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2 pointer-events-none"
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
                  className="w-full h-56 md:h-64 lg:h-72 xl:h-74 object-cover rounded-[8px]"
                />
                <div className="absolute bottom-0 text-[16px] py-1 sm:text-[21px] md:text-[18px] lg:text-[18px] xl:text-[18px] text-gray-500 font-regular leading-tight lg:leading-[1.3] left-1/2 transform -translate-x-1/2 bg-[#e9e0d4] px-3  font-figtree rounded-t-lg">
                  {item.date}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-[18px] sm:text-[21px] md:text-[23px] lg:text-[25px] xl:text-[25px] leading-snug leading-tight text-black-700 px-2 font-figtree">
                {item.title}
              </h3>

              {/* Read More */}
              <button className="flex items-center gap-2 mx-auto font-figtree text-[16px] sm:text-[21px] md:text-[20px] lg:text-[18px] xl:text-[18px] transition group">
                <span className="text-gray text-[16px] sm:text-[21px] md:text-[20px] lg:text-[18px] xl:text-[18px]">
                  Read More
                </span>
                <span className="text-[#8c2f24] transform transition-transform duration-200 group-hover:translate-x-[5px]">
                  <ArrowRight size={20} strokeWidth={2} />
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InspirationBoard;
