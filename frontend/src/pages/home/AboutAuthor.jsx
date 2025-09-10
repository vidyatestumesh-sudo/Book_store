import React from "react";
import { Link } from "react-router-dom";

const AboutAuthor = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 font-serif space-y-16">

      {/* ========== About Author Section ========== */}
      <div className="bg-[#f6f6f6] rounded-xl shadow p-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

        {/* Left Content */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-semibold mb-2 relative inline-block">
            About Author
            <img
              src="/feather.png"
              alt="feather"
              className="absolute -top-6 left-0 w-10 opacity-30"
            />
          </h2>
          <p className="text-lg text-gray-700 mt-4">
            This is me in the given picture. You and I are one.
          </p>
          <p className="italic text-gray-600 mt-4 text-sm leading-relaxed max-w-xl">
            At a very young age Anil Kumar sensed conflict, physical, social and
            psychological, both inside and around him, and discovered a secret
            ally which he calls Nature that has always given him the strength to
            withstand adversity and courage….
          </p>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-[260px] h-auto">
          <img
            src="/author_logo.png"
            alt="Anil Kumar"
            className="object-contain w-full"
          />
        </div>
      </div>

      {/* ========== Working Creed Section ========== */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

        {/* Left Image */}
        <div className="w-full md:w-1/2">
          <img
             src="/b1.jpg"
            alt="Working Creed"
            className="rounded-lg w-full h-48 object-cover"
          />
        </div>

        {/* Right Text */}
        
        <div className="w-full md:w-1/2 text-left">
          <h2 className="text-2xl md:text-3xl font-semibold relative inline-block mb-4">
            ANIL'S WORKING CREED
            <img
              src="/feather.png"
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
