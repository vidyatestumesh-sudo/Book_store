import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

const AboutAuthorPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 font-['Poppins'] space-y-24">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-10 bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-3xl shadow-xl p-12 hover:shadow-2xl transition-all duration-700">
        <img
          src="/author_logo.png"
          alt="Author"
          className="w-64 h-64 rounded-full border-4 border-pink-500 shadow-lg object-cover transform hover:scale-105 hover:rotate-3 transition-all duration-500"
        />
        <div className="text-center md:text-left space-y-6">
          <h1 className="text-5xl font-bold text-purple-800 hover:text-pink-600 transition-colors duration-300">
            Meet Anil Kumar
          </h1>
          <p className="text-lg text-gray-800 leading-relaxed">
            Welcome to Langshott Leadership Foundation, a charitable organisation and provider of mentorship and guidance in personal leadership through seminars, workshops, talks, books, inspirational collections, blogs, and uplifting wisdom in the form of quotations. See this site as your home for inspiration and enlightenment.
          </p>
          <br />
          <span className="text-purple-600 font-semibold underline decoration-pink-400 decoration-2 underline-offset-4 hover:text-orange-500 transition-colors duration-300">
              “The solutions you’re searching for are within you, we can only help you to get there”
            </span>
          <div className="flex justify-center md:justify-start gap-4 pt-4">
            {[
              { icon: <FaTwitter />, bg: "bg-pink-500", hover: "hover:bg-pink-600" },
              { icon: <FaFacebookF />, bg: "bg-purple-500", hover: "hover:bg-purple-600" },
              { icon: <FaLinkedinIn />, bg: "bg-yellow-500", hover: "hover:bg-yellow-600" },
            ].map(({ icon, bg, hover }, i) => (
              <a
                key={i}
                href="#"
                className={`w-10 h-10 flex items-center justify-center text-white ${bg} ${hover} rounded-full transition transform hover:scale-110 shadow-md hover:shadow-lg`}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / Story */}
      <section className="space-y-12">
        <h2 className="text-4xl text-center font-bold text-purple-700 mb-4 hover:text-pink-600 transition-colors">
          Anil Kumar’s Journey
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Early Life",
              desc: "Inspired by the world around him, Anil began journaling and exploring personal development from a young age.",
            },
            {
              title: "Writing Career",
              desc: "He published over 10 best-selling books focused on mindfulness and living intentionally.",
            },
            {
              title: "Community Impact",
              desc: "Anil leads retreats, workshops, and events globally to help others heal, reflect, and grow.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
            >
              <h3 className="text-2xl font-semibold text-purple-700 mb-2 hover:text-pink-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl py-16 px-10 shadow-inner relative overflow-hidden">
        <h2 className="text-4xl font-bold text-purple-800 mb-4 hover:text-pink-600 transition-colors">
          Discover More from Anil
        </h2>
        <p className="max-w-2xl mx-auto text-gray-800 leading-relaxed mb-8">
          Dive into blog articles, resources, and exclusive behind-the-scenes insights curated for
          passionate readers and seekers like you.
        </p>
        <Link
          to="/blogs"
          className="relative inline-block px-8 py-3 rounded-full bg-purple-600 text-white font-semibold text-lg tracking-wide uppercase transition-all duration-300 shadow-md hover:bg-pink-500 hover:shadow-xl hover:scale-105"
        >
          Explore Blogs
        </Link>
      </section>
    </div>
  );
};

export default AboutAuthorPage;
