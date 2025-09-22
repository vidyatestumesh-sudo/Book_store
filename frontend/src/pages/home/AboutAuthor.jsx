import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// JSON structure for content
const content = {
  "sectionHeading": {
    "text": "Anil Kumar",
    "motifImage": {
      "src": "/motif.webp",
      "alt": "Feather motif decoration"
    }
  },
  "aboutAuthor": {
    "leftText": {
      "heading": "Anil Kumar",
      "paragraphs": [
        {
          "text": "This is me in the given picture. You and I are one.",
          "style": "text-base leading-relaxed leading-snug leading-tight font-figtree font-regular-700 mb-4 text-[18px] sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-[26px]"
        },
        {
          "text": "At a very young age Anil Kumar sensed conflict, physical, social and psychological, both inside and around him, and discovered a secret ally which he calls Nature that has always given him the strength to withstand adversity and courage…",
          "style": "italic text-base leading-relaxed text-left text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] xl:text-[20px] text-black-800 font-Figtree font-regular leading-tight lg:leading-[1.3] text-black/80"
        }
      ]
    },
    "rightImage": {
      "src": "/about-author-ak .webp",
      "alt": "Portrait of Anil Kumar, the author"
    }
  },
  "workingCreed": {
    "leftImage": {
      "src": "/anils-working-creed.webp",
      "alt": "Illustration of Anil Kumar's working creed"
    },
    "rightText": {
      "heading": "Anil's Working Creed",
      "paragraphs": [
        {
          "text": "The following words are my statement of beliefs that I seek to hold as my constant companion.",
          "style": "text-black/80 mb-4 sm:mr-8 text-base leading-relaxed font-figtree text-[16px] sm:text-[18px] md:text-[18px] lg:text-[20px] xl:text-[20px] text-black-800 leading-snug lg:leading-normal font-regular leading-tight lg:leading-[1.3]"
        }
      ],
      "link": {
        "text": "Read More",
        "to": "/aboutauthorpage"
      }
    }
  }
};

// SectionHeading component
const SectionHeading = ({ children, showMotif = true }) => (
  <div className="relative inline-block mb-6">
    <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight">
      {children}
    </h1>
    {showMotif && (
      <img
        src={content.sectionHeading.motifImage.src}
        alt={content.sectionHeading.motifImage.alt}
        className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15]"
        loading="lazy"
      />
    )}
  </div>
);

// AboutAuthor component
const AboutAuthor = () => {
  return (
    <section className="max-w-8xl mx-auto px-4 md:px-6 py-0 md:py-16 font-Figtree space-y-8">
      {/* ========== About Author Section ========== */}
      <article className="bg-[#e9ebec] rounded-xl p-4 py-5 sm:p-6 md:p-10 px-3 sm:px-6 md:px-10 flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-10 md:gap-20">
        {/* Left Side - Text */}
        <div className="flex-1 px-2 md:px-5 md:ml-12">
          <SectionHeading>{content.aboutAuthor.leftText.heading}</SectionHeading>
          {content.aboutAuthor.leftText.paragraphs.map((para, idx) => (
            <p
              key={idx}
              className={para.style}
            >
              {para.text}
            </p>
          ))}
        </div>

        {/* Right Side - Image */}
        <div className="flex flex-col items-center">
          <img
            src={content.aboutAuthor.rightImage.src}
            alt={content.aboutAuthor.rightImage.alt}
            className="w-[480px] md:w-[480px] lg:w-[490px]"
            loading="lazy"
          />
        </div>
      </article>

      {/* ========== Anil's Working Creed Section ========== */}
      <article className="rounded-xl p-4 sm:p-6 md:p-10 px-0 sm:px-6 md:px-10 flex flex-col lg:flex-row items-center lg:items-start gap-5 sm:gap-6 md:gap-10">
        {/* Left Image */}
        <figure className="w-full lg:w-1/2 rounded-lg object-cover overflow-hidden">
          <img
            src={content.workingCreed.leftImage.src}
            alt={content.workingCreed.leftImage.alt}
            className="w-full h-68 sm:w-min-[200px]"
            loading="lazy"
          />
        </figure>

        {/* Right Text */}
        <div className="w-full lg:w-1/2 text-left px-6 md:px-0 lg:py-10 [@media(min-width:2561px)]:py-0">
          <SectionHeading showMotif={false}>{content.workingCreed.rightText.heading}</SectionHeading>
          {content.workingCreed.rightText.paragraphs.map((para, idx) => (
            <p
              key={idx}
              className={para.style}
            >
              {para.text}
            </p>
          ))}
          <Link
            to={content.workingCreed.rightText.link.to}
            className="group inline-flex items-center text-sm no-underline font-figtree transition-colors duration-200 text-[18px]"
          >
            <span className="text-black text-[16px] sm:text-[18px] leading-snug lg:leading-normal">
              {content.workingCreed.rightText.link.text}
            </span>
            <span className="text-[#8c2f24] ml-1 transform transition-transform duration-200 group-hover:translate-x-[5px]">
              <ArrowRight size={20} strokeWidth={2} />
            </span>
          </Link>
        </div>
      </article>
    </section>
  );
};

export default AboutAuthor;
