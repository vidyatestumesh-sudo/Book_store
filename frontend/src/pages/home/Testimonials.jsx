import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Testimonials = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const testimonials = [
    {
      name: "Customer 1",
      text: "I had an amazing experience with these books. They are insightful, motivating, and practical. I learned a lot about mindfulness and self-improvement, and the content truly inspired me to take action in my daily life.",
      animation: "fade-up-right",
    },
    {
      name: "Customer 2",
      text: "The books exceeded my expectations! They provide clear guidance, valuable lessons, and actionable steps. I feel more confident and focused in my personal and professional life after reading them.",
      animation: "fade-up",
    },
    {
      name: "Customer 3",
      text: "Absolutely loved the content! Each book is carefully crafted and easy to understand. The stories, tips, and insights helped me develop a positive mindset and achieve my goals faster.",
      animation: "fade-up-left",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto font-['Poppins'] py-20 px-6 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-100 mt-2">
      <h2
        className="text-5xl font-bold text-center font-['Poppins'] mb-14 mt-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-transparent bg-clip-text animate-text"
        data-aos="fade-up"
      >
        🌟 What Our Readers Say
      </h2>

      <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="relative w-full sm:w-[22rem] bg-white rounded-3xl shadow-lg p-8 text-left transform transition duration-500 hover:-translate-y-3 hover:shadow-2xl hover:scale-[1.03] hover:rotate-[-1.2deg]"
            data-aos={t.animation}
          >
            {/* Floating Quote Icon */}
            <div className="text-5xl text-pink-400 leading-none mb-4 -mt-2">
              “
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-700 text-sm leading-relaxed mb-6">
              {t.text}
            </p>

            {/* Name */}
            <span className="block font-semibold text-purple-600 text-sm">
              — {t.name}
            </span>

            {/* Glow Overlay */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-black/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
