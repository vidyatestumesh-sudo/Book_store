import React from "react";
import { Link } from "react-router-dom";

const AboutAuthor = () => {
  return (
    <section className="max-w-8xl mx-auto px-6 py-16 font-serif space-y-16">

      {/* ========== About Author Section ========== */}
      <div className="bg-[#e9ebec] rounded-xl px-5 p-10 flex flex-col md:flex-row items-center md:items-start  gap-8">

        {/* Left Content */}

        <div className="flex-1 px-5">
          <div className="relative inline-block">
            <h1 className="text-[50px] font-playfair font-display leading-snug mb-8 mt-8">
              About Author
            </h1>
            <img
              src="/motif.webp"
              alt="feather"
              className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-25 h-28 md:w-28 md:h-22 [opacity:0.15] mb-2"
            />
          </div>
          <p className="md:text-base leading-relaxed whitespace-pre-line font-regular font-figtree">
            This is me in the given picture. You and I are one.
          </p>
          <p className="italic md:text-base leading-relaxed whitespace-pre-line font-light font-figtree pe-5">
            At a very young age Anil Kumar sensed conflict, physical, social and
            psychological, both inside and around him, and discovered a secret
            ally which he calls Nature that has always given him the strength to
            withstand adversity and courage….
          </p>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-[260px] h-auto">
          <img
            src="/about-author-ak .webp"
            alt="Anil Kumar"
            className="object-contain w-full"
          />
          {/* Stroke line below image */}
          <div className="w-200 mx-auto border-b-2 border-[#8c6239] opacity-60 mt-1"></div>
        </div>


      </div>

      {/* ========== Working Creed Section ========== */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

        {/* Left Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/anils-working-creed.webp"
            alt="Working Creed"
            className="rounded-lg w-full h-48 object-cover"
          />
        </div>

        {/* Right Text */}

        <div className="w-full md:w-1/2 text-left">
          <h2 className="text-2xl md:text-3xl font-semibold relative inline-block mb-4">
            ANIL'S WORKING CREED
            <img
              src="/motif.webp"
              alt="feather"
              className="absolute -bottom-4 left-0 w-12 opacity-20"
            />
          </h2>

          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
            The following words are my statement of beliefs that I seek to hold as
            my constant companion.
          </p>
          <Link to="/aboutauthorpage" className="hover:text-[#8c6239]">
            Read More →
          </Link>

        </div>
      </div>
    </section>
  );
};

export default AboutAuthor;
