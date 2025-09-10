import React from "react";
import { FaTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

const AboutAuthor = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 font-['Poppins'] bg-gradient-to-r from-purple-50 via-orange-50 to-pink-50 rounded-2xl shadow-xl">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10">

        {/* Custom-Shaped Big Author Image */}
        <div className="relative w-full md:w-[40%] transform transition-transform duration-700 hover:scale-105 hover:shadow-2xl">
          <div
            className="w-full h-[480px] bg-cover bg-center"
            style={{
              backgroundImage: "url('/author_logo.png')",
              clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
              border: "6px solid #d946ef",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            }}
          />
        </div>

        {/* Author Info */}
        <div className="flex-1 space-y-6">
          <h2 className="text-6xl font-extrabold bg-gradient-to-r from-pink-600 via-orange-500 to-purple-600 text-transparent bg-clip-text">
            Anil Kumar
          </h2>

          <p className="text-lg text-gray-800 leading-relaxed">
            <span className="font-semibold text-pink-800">
            </span> Welcome to Langshott Leadership Foundation, a charitable organisation and provider of mentorship and guidance in personal leadership through seminars, workshops, talks, books, inspirational collections, blogs, and uplifting wisdom in the form of quotations. See this site as your home for inspiration and enlightenment. {" "}
            <br />
            <br></br>
            <span className="text-purple-600 font-semibold underline decoration-pink-400 decoration-2 underline-offset-4 hover:text-orange-500 transition-colors duration-300">
              “The solutions you’re searching for are within you, we can only help you to get there”
            </span>
          </p>

          {/* Achievements List */}
          <ul className="list-disc list-inside text-gray-700 text-base space-y-2">
            {[
              "Author",
              'Founder of the "Langshott Leadership Foundation"',
            ].map((item, idx) => (
              <li
                key={idx}
                className="hover:text-pink-600 hover:translate-x-1 transform transition duration-300"
              >
                {item}
              </li>
            ))}
          </ul>

          {/* Social Links */}
          <div className="flex gap-4 pt-4">
            {[
              { icon: <FaTwitter />, color: "bg-indigo-500", hover: "hover:bg-indigo-600" },
              { icon: <FaFacebookF />, color: "bg-blue-500", hover: "hover:bg-blue-600" },
              { icon: <FaLinkedinIn />, color: "bg-purple-500", hover: "hover:bg-purple-600" },
            ].map(({ icon, color, hover }, idx) => (
              <a
                key={idx}
                href="#"
                className={`w-10 h-10 ${color} ${hover} text-white rounded-full flex items-center justify-center transition transform hover:scale-110 shadow-md`}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutAuthor;
