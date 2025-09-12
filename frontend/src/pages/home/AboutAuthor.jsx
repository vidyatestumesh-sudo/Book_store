import React from "react";
import { Link } from "react-router-dom";

const SectionHeading = ({ children }) => (
  <div className="relative inline-block mb-8">
    <h1 className="text-[50px] font-playfair leading-snug">{children}</h1>
    <img
      src="/motif.webp"
      alt="Feather motif decoration"
      className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 md:w-28 opacity-15"
      loading="lazy"
    />
  </div>
);

const AboutAuthor = () => {
  return (
    <section className="max-w-8xl mx-auto px-4 md:px-6 py-16 font-serif space-y-16">

      {/* ========== About Author Section ========== */}
      <article className="bg-[#e9ebec] rounded-xl p-10 px-4 md:px-10 flex flex-col lg:flex-row items-center lg:items-start gap-8">

        {/* Left Side - Text */}
        <div className="flex-1 px-2 md:px-5 ps-5">
          <SectionHeading>About Author</SectionHeading>

          <p className="text-base leading-relaxed font-figtree font-normal mb-4 !text-[25px]">
            This is me in the given picture. You and I are one.
          </p>
          <p className="italic text-base leading-relaxed font-figtree font-normal !text-[21px] text-black/80">
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
            alt="Portrait of Anil Kumar, the author"
            className="w-[470px] md:w-[470px] lg:w-[490px]"
            loading="lazy"
          />
        </div>
      </article>

      <article className="flex flex-col lg:flex-row items-center lg:items-start gap-8 px-4 md:px-0">

  {/* Left Image */}
  <figure className="w-full lg:w-1/2 rounded-lg overflow-hidden">
    <img
      src="/anils-working-creed.webp"
      alt="Illustration of Anil Kumar's working creed"
      className="w-full h-64 object-cover"
      loading="lazy"
    />
  </figure>

  {/* Right Text */}
  <div className="w-full lg:w-1/2 text-left px-2 md:px-4">
    <SectionHeading showMotif={false}>Anil's Working Creed</SectionHeading>

    <p className="text-black/80 mb-4 text-base leading-relaxed font-figtree !text-[21px]">
      The following words are my statement of beliefs that I seek to hold as my constant companion.
    </p>

    <Link
      to="/aboutauthorpage"
      className="group inline-block text-sm no-underline font-figtree transition-colors duration-200 text-[18px]"
    >
      <span className="text-black !text-[18px]">Read More</span>
      <span className="text-[#8c2f24] ml-1 inline-block transform transition-transform duration-200 group-hover:translate-x-[5px] text-[21px]">
        →
      </span>
    </Link>
  </div>
</article>

    </section>
  );
};

export default AboutAuthor;
