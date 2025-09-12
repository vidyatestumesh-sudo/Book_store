import React from "react";

const Banner = () => {
  return (
    <div className="max-w-screen-9xl mx-auto flex flex-col lg:flex-row font-Figtree items-center justify-between px-4 min-h-screen lg:min-h-[500px] xl:min-h-[600px] 2xl:min-h-[700px] overflow-hidden pt-4">
      
      {/* Left Image Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 lg:px-8 xl:px-12 2xl:px-16">
        <img
          src="anil-kumar.webp"
          alt="Langshott Foundation Author"
          className="w-full max-h-[700px] object-contain mx-auto select-none transition duration-300"
        />
      </div>

      {/* Right Text Section */}
      <div className="w-full lg:w-1/2 h-auto lg:h-full px-4 lg:py-0 text-center flex flex-col justify-center items-center overflow-y-auto max-w-[700px] xl:max-w-[800px] mx-auto">
        
        {/* Logo */}
        <div className="mb-6">
          <img
            src="/langshott-foundation-logo.webp"
            alt="Langshott Leadership Foundation"
            className="h-28 md:h-28 max-h-32 w-auto block select-none mx-auto mt-0"
          />
        </div>

        {/* Title Section */}
        <div className="relative inline-block text-center">
          <h1 className="text-[26px] sm:text-[36px] md:text-[50px] font-playfair text-black leading-tight mb-6">
            Langshott Leadership Foundation
          </h1>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-0 mb-4 transform -translate-x-1/2 w-24 sm:w-24 md:w-32 h-auto opacity-15"
          />
        </div>

        {/* Description */}
        <p className="text-black-800 text-[20px] leading-relaxed mt-10 mb-6 font-regular px-2 sm:px-4">
          Welcome to Langshott Leadership Foundation, a charitable organisation
          and provider of mentorship and guidance in personal leadership through
          seminars, workshops, talks, books, inspirational collections, blogs, and
          uplifting wisdom in the form of quotations. See this site as your home
          for inspiration and enlightenment.
        </p>

        {/* Highlighted Quote */}
        <p className="text-[25px]  text-[#8c2f2f] italic px-4 sm:px-10 font-regular">
          "The solutions you’re searching for are within you; we can only help you
          to get there."
        </p>
      </div>
    </div>
  );
};

export default Banner;
