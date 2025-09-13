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
        <div className="mb-6 sm:mb-8">
          <img
            src="/langshott-foundation-logo.webp"
            alt="Langshott Leadership Foundation"
            className="h-24 sm:h-28 max-h-32 w-auto block select-none mx-auto mt-0"
          />
        </div>

        {/* Title Section */}
        <div className="relative inline-block text-center">
          <h1 className="text-[26px] sm:text-[36px] md:text-[50px] font-playfair text-black leading-tight mt-4 mb-4 sm:mb-6">
            Langshott Leadership Foundation
          </h1>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-2 sm:-bottom-0 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 h-auto opacity-15 mb-4 md:mb-6"
          />
        </div>

        {/* Description */}
        <p className="text-black-800 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-snug lg:leading-normal mt-2 lg:mt-4 mb-6 font-regular px-2 sm:px-2">
          Welcome to Langshott Leadership Foundation, a charitable organisation
          and provider of mentorship and guidance in personal leadership through
          seminars, workshops, talks, books, inspirational collections, blogs, and
          uplifting wisdom in the form of quotations. See this site as your home
          for inspiration and enlightenment.
        </p>

        {/* Stars Divider */}
        <div className="flex justify-center gap-2 text-gray-600 mb-0 font-bellmt">
          {/* Always visible (first 5 stars → mobile baseline) */}
          <span className="text-2xl sm:text-3xl lg:text-4xl">*</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl">*</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl">*</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl">*</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl">*</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl">*</span>

          {/* Extra 2 stars → show from md (tablet) */}
          <span className="hidden md:inline text-3xl lg:text-4xl">*</span>
          <span className="hidden md:inline text-3xl lg:text-4xl">*</span>
          <span className="hidden md:inline text-3xl lg:text-4xl">*</span>

          {/* Extra 3 stars → show from lg (desktop) */}
          <span className="hidden lg:inline text-4xl">*</span>
          <span className="hidden lg:inline text-4xl">*</span>
          <span className="hidden lg:inline text-4xl">*</span>
          <span className="hidden lg:inline text-4xl">*</span>
          <span className="hidden lg:inline text-4xl">*</span>
          <span className="hidden lg:inline text-4xl">*</span>
        </div>

        {/* Highlighted Quote */}
        <p className="text-[18px] sm:text-[22px] md:text-[25px] lg:text-[28px] xl:text-[30px] text-[#8c2f2f] italic px-4 sm:px-10 font-regular text-center leading-snug">
          "The solutions you’re searching for are within you; we can only help you
          to get there."
        </p>


      </div>
    </div>
  );
};

export default Banner;
