import React, { useState } from "react";

const blogs = [
  {
    id: 1,
    title: "Mindfulness in Daily Life",
    shortContent:
      "Discover the transformative power of mindfulness in daily life...",
    fullContent:
      "Discover the transformative power of mindfulness in daily life. Learn practical tips to reduce stress, increase focus, and cultivate inner peace. This blog guides readers step-by-step towards living more consciously and intentionally. Learn breathing techniques, how to stay present, and ways to handle distractions throughout your day.",
    image: "/b1.jpg",
  },
  {
    id: 2,
    title: "Personal Growth Strategies",
    shortContent:
      "Explore effective strategies for personal growth and self-improvement...",
    fullContent:
      "Explore effective strategies for personal growth and self-improvement. From developing better habits to mastering productivity techniques, this blog helps readers unlock their potential and achieve their goals in meaningful ways. Includes actionable steps and habit-building systems.",
    image: "/b2.jpg",
  },
  {
    id: 3,
    title: "Power of Positive Thinking",
    shortContent:
      "Understand the impact of positive thinking and mental resilience...",
    fullContent:
      "Understand the impact of positive thinking and mental resilience. This blog offers inspiring examples and actionable advice to overcome challenges, stay motivated, and maintain a healthy mindset in all aspects of life. Learn how to reframe setbacks, practice gratitude, and build grit.",
    image: "/b3.jpg",
  },
];

const BlogsPage = () => {
  const [expandedBlogId, setExpandedBlogId] = useState(null);

  const handleToggle = (id) => {
    setExpandedBlogId(expandedBlogId === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-100 min-h-screen font-['Poppins']">
      <h2 className="mb-14 text-5xl font-bold text-center bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text animate-text">
        📝 Latest Blogs
      </h2>

      <div className="space-y-12">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="group flex flex-col md:flex-row items-center bg-white rounded-3xl shadow-xl hover:shadow-2xl transition duration-500 overflow-hidden hover:-translate-y-2"
          >
            {/* Blog Image */}
            <div className="w-full md:w-1/2 relative h-64 md:h-80 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Blog Content */}
            <div className="w-full md:w-1/2 p-8 space-y-4 text-gray-800">
              <h3 className="text-3xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-transparent bg-clip-text transition duration-300 group-hover:scale-105">
                {blog.title}
              </h3>

              <p className="text-gray-600 leading-relaxed text-md transition-all duration-500 ease-in-out">
                {expandedBlogId === blog.id
                  ? blog.fullContent
                  : blog.shortContent}
              </p>

              <button
                onClick={() => handleToggle(blog.id)}
                className="inline-block mt-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-md hover:from-pink-600 hover:to-orange-500 transition-all duration-300"
              >
                {expandedBlogId === blog.id ? "Read Less ↑" : "Read More →"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogsPage;
