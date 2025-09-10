import React from "react";

const Banner = () => {
  return (
    <section className="bg-[#d9d0c5] font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        
        {/* Left Image Section */}
        <div className="w-full md:w-1/2">
          <img
            src="anil-kumar.webp" 
            alt="Langshott Foundation Author"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Text Section */}
        <div className="w-full md:w-1/2 bg-[#d9d0c5] px-6 md:px-12 py-12 md:py-20 text-left">
          
          {/* Logo */}
          <div className="mb-6">
            <img
              src="/langshott-foundation-logo.webp" 
              alt="Langshott Leadership Foundation"
              className="h-12 md:h-14"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-[36px] font-serif font-bold text-gray-900 leading-snug mb-6">
            Intro to Langshott Foundation
          </h1>

          {/* Description */}
          <p className="text-gray-800 text-[16px] leading-relaxed mb-6 max-w-xl">
            Welcome to Langshott Leadership Foundation, a charitable organisation
            and provider of mentorship and guidance in personal leadership through
            seminars, workshops, talks, books, inspirational collections, blogs, and
            uplifting wisdom in the form of quotations. See this site as your home
            for inspiration and enlightenment.
          </p>

          {/* Highlighted Quote */}
          <p className="italic text-[18px] md:text-[20px] font-serif text-[#8c2f2f]">
            "The solutions you’re searching for are within you, we can only help you
            to get there"
          </p>
        </div>
      </div>
    </section>
  );
};

export default Banner;
