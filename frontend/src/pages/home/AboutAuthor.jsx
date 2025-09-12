import React from "react";
import { Link } from "react-router-dom";

const AboutAuthor = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 font-serif space-y-16">

      {/* ========== About Author Section ========== */}
      <div className="bg-[#e9ebec] rounded-xl p-10 px-5 flex flex-col md:flex-row items-center md:items-start gap-8">

        {/* Left Side - Text */}
        <div className="flex-1 px-5">
          <div className="relative inline-block mb-8">
            <h1 className="text-[50px] font-playfair leading-snug">
              About Author
            </h1>
            <img
              src="/motif.webp"
              alt="feather"
              className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 md:w-28 opacity-15"
            />
          </div>

          <p className="text-base leading-relaxed font-figtree mb-4 text-[20px]">
            This is me in the given picture. You and I are one.
          </p>
          <p className="italic text-base leading-relaxed font-figtree font-light text-[18px]">
            At a very young age Anil Kumar sensed conflict, physical, social and
            psychological, both inside and around him, and discovered a secret
            ally which he calls Nature that has always given him the strength to
            withstand adversity and courage….
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="flex flex-col items-center">
          <img
            src="/about-author-ak .webp"
            alt="Anil Kumar"
            className="w-[300px] md:w-[320px] lg:w-[360px] object-contain"
          />
          <div className="w-full border-b-[2px] border-[#8c6239] opacity-60 mt-[1px]" />
        </div>
      </div>


      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

        {/* Left Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/anils-working-creed.webp"
            alt="Working Creed"
            className="rounded-lg w-full h-64 object-cover"
          />
        </div>

        {/* Right Text */}
        <div className="w-full md:w-1/2 text-left">
          <div className="relative inline-block mb-8">
            <h1 className="text-[50px] font-playfair leading-snug">
              Anil's Working Creed
            </h1>
            <img
              src="/motif.webp"
              alt="feather"
              className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 md:w-28 opacity-15"
            />
          </div>

          <p className="text-gray-700 mb-4 text-base leading-relaxed font-figtree text-[18px]">
            The following words are my statement of beliefs that I seek to hold as my constant companion.
          </p>

          <Link
            to="/aboutauthorpage"
            className="inline-block text-sm no-underline font-figtree transition-colors duration-200 text-[18px]"
          >
            <span className="text-black">Read More</span>
            <span className="text-[#8c2f24] ml-1 inline-block transform transition-transform duration-20 group-hover:translate-x-[15px]">
              →</span>
          </Link>


        </div>
      </div>

    </section>
  );
};

export default AboutAuthor;
