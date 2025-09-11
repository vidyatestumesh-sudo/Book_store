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
      <div className="w-[700px] h-[700px] px-2 md:px-2 py-0 md:py-15 text-center flex flex-col justify-center items-center">

        {/* Logo */}
        <div className="mb-6">
          <img
            src="/langshott-foundation-logo.webp"
            alt="Langshott Leadership Foundation"
            className="h-25 md:h-30 max-h-32 md:max-h-40 w-auto max-w-full block select-none mx-auto mt-0"
          />
        </div>

        {/* Title Section */}
        <div className="relative inline-block">
          <h1 className="text-[50px] font-playfair font-display leading-snug mb-6 mt-8">
            Langshott Leadership Foundation
          </h1>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-38 h-36 md:w-38 md:h-22 [opacity:0.15] mb-6"
          />
        </div>

        {/* Description */}
        <p className="text-gray-800 text-[20px] leading-relaxed mb-6 max-w-xxl font-figtree font-light">
          Welcome to Langshott Leadership Foundation, a charitable organisation
          and provider of mentorship and guidance in personal leadership through
          seminars, workshops, talks, books, inspirational collections, blogs, and
          uplifting wisdom in the form of quotations. See this site as your home
          for inspiration and enlightenment.
        </p>

        {/* Highlighted Quote */}
        <p className="text-[20px] md:text-[20px] text-[#8c2f2f] font-figtree italic ml-28 mr-28">
          "The solutions you’re searching for are within you, we can only help you
          to get there"
        </p>
      </div>

    </div>
  );
};

export default Banner;
