import React from "react";

const Banner = () => {
  return (

    <div className="max-w-8xl mx-auto flex flex-col md:flex-row font-Figtree items-center justify-between">

      {/* Left Image Section */}
      <div className="w-[700px] h-[700px] ">
        <img
          src="anil-kumar.webp"
          alt="Langshott Foundation Author"
          className="w-full h-full block mx-auto select-none cursor-zoom-out bg-[hsla(0, 0%, 100%, 1.00)] transition-colors duration-300 mt-4 ml-0"
        />
      </div>

      {/* Right Text Section */}
      <div className="w-[700px] h-[700px]  px-2 md:px-2 py-2 md:py-20 text-left">

        {/* Logo */}
        <div className="mb-6">
          <img
            src="/langshott-foundation-logo.webp"
            alt="Langshott Leadership Foundation"
            className="h-25 md:h-30 max-h-32 md:max-h-40 w-auto max-w-full block select-none mx-auto cursor-zoom-out transition-colors duration-300 mt-0"
          />
        </div>
        {/* Title Section */}
        <div className="flex justify-center items-center font-figtree text-center">
          <div className="relative inline-block font-figtree ">
            <h1 className="text-5xl font-flayfair font-medium leading-snug mb-6">
              Langshott Foundation
            </h1>
            <img
              src="/motif.webp"
              alt="feather"
              className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 [opacity:0.15]"
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-800 text-[16px] leading-relaxed mb-6 max-w-xl font-figtree font-light">
          Welcome to Langshott Leadership Foundation, a charitable organisation
          and provider of mentorship and guidance in personal leadership through
          seminars, workshops, talks, books, inspirational collections, blogs, and
          uplifting wisdom in the form of quotations. See this site as your home
          for inspiration and enlightenment.
        </p>

        {/* Highlighted Quote */}
        <p className="italic text-[18px] md:text-[20px] text-[#8c2f2f] font-figtree italic text-lg">
          "The solutions you’re searching for are within you, we can only help you
          to get there"
        </p>
      </div>
    </div>
  );
};

export default Banner;
