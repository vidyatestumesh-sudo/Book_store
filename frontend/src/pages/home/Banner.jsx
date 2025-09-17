import React from "react";

const Banner = () => {
  return (
    <div className="max-w-screen-9xl mx-auto font-Figtree overflow-hidden pt-4 px-4 grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[700px] sm:min-h-[750px] md:min-h-[800px] lg:min-h-[500px] xl:min-h-[600px] 2xl:min-h-[700px]">
      {/* Left Image Section */}
      <div className="flex items-center justify-center px-4 lg:px-8 xl:px-12 2xl:px-16 h-full">
        <img
          src="anil-kumar.webp"
          alt="Langshott Foundation Author"
          className="w-full max-h-[700px] object-contain mx-auto select-none transition duration-300"
        />
      </div>

      {/* Right Text Section */}
      <div className="relative bg-transparent px-4 lg:py-0 text-center flex flex-col justify-center items-center overflow-y-auto max-w-[700px] xl:max-w-[800px] mx-auto h-full">
        {/* Logo */}
        <div className="mb-6 sm:mb-8">
          <img
            src="/langshott-foundation-logo.webp"
            alt="Langshott Leadership Foundation"
            className="h-26 sm:h-30 max-h-34 w-auto block select-none mx-auto mt-0"
          />
        </div>

        {/* Title Section */}
        <div className="relative inline-block text-center">
          <h1 className="text-[30px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mt-4 mb-4 sm:mb-6">
            Langshott Leadership Foundation
          </h1>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-2 sm:-bottom-0 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 h-auto opacity-15 mb-4 md:mb-6"
          />
        </div>

        {/* Description */}
        <p className="text-[16px] sm:text-[18px] md:text-[18px] lg:text-[20px] xl:text-[20px] text-black-800 font-Figtree font-regular leading-tight lg:leading-[1.3] mt-2 lg:mt-4 mb-3 px-2 sm:px-2 text-center">
          Welcome to Langshott Leadership Foundation, a charitable organisation
          and provider of mentorship and guidance in personal leadership through
          seminars, workshops, talks, books, inspirational collections, blogs, and
          uplifting wisdom in the form of quotations. See this site as your home
          for inspiration and enlightenment.
        </p>

        {/* Stars Divider */}
        <div className="flex justify-center gap-2 text-gray-600 mb-0 font-bellmt">
          <span className="text-2xl sm:text-3xl lg:text-4xl">*</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl">*</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl">*</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl">*</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl">*</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl">*</span>
          <span className="hidden md:inline text-3xl lg:text-4xl">*</span>
          <span className="hidden md:inline text-3xl lg:text-4xl">*</span>
          <span className="hidden md:inline text-3xl lg:text-4xl">*</span>
          <span className="hidden lg:inline text-4xl">*</span>
          <span className="hidden lg:inline text-4xl">*</span>
          <span className="hidden lg:inline text-4xl">*</span>
          <span className="hidden lg:inline text-4xl">*</span>
          <span className="hidden lg:inline text-4xl">*</span>
          <span className="hidden lg:inline text-4xl">*</span>
        </div>

        {/* Highlighted Quote */}
        <p className="text-[17px] sm:text-[22px] md:text-[24px] lg:text-[25px] xl:text-[25px] font-Figtree font-regular leading-snug leading-tight text-[#8c2f2f] italic lg:leading-[1.3] px-4 sm:px-10 text-center">
          "The solutions you’re searching for are within you; we can only help you to get there."
        </p>
      </div>
    </div>
  );
};

export default Banner;
