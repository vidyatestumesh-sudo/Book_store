import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BACKEND_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://bookstore-backend-hshq.onrender.com";

const InspirationBoard = () => {
  const [inspirations, setInspirations] = useState([]);

  useEffect(() => {
    const fetchInspirations = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
        const data = await res.json();

        const filtered = data
          .filter((item) => item.type === "inspiration" && !item.suspended)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by recent
          .slice(0, 3); // Only take 3 most recent

        setInspirations(filtered);
      } catch (error) {
        console.error("Error fetching inspiration blogs:", error);
      }
    };

    fetchInspirations();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full bg-[#e9e0d4] font-playfair text-gray-900">
      <div className="w-full max-w-8xl mx-auto px-6 sm:px-8 lg:px-8 xl:px-4 py-12 text-center">
        {/* Section Title */}
        <div className="relative inline-block mb-12">
          <h2 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mb-4">
            Inspiration Board
          </h2>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2 pointer-events-none"
          />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {inspirations.length === 0 ? (
            <p className="col-span-3 text-gray-500">No inspiration found.</p>
          ) : (
            inspirations.map((item) => (
              <div key={item._id} className="space-y-4 text-center">
                {/* Image */}
                <div className="relative">
                  <img
                    src={
                      item.image?.startsWith("http")
                        ? item.image
                        : `${BACKEND_BASE_URL}${item.image}`
                    }
                    alt={item.title}
                    className="w-full h-56 md:h-64 lg:h-72 xl:h-74 object-cover rounded-[8px]"
                  />
                  <div className="absolute bottom-0 text-[14px] py-1 sm:text-[16px] md:text-[17px] lg:text-[17px] xl:text-[17px] text-gray-500 font-regular leading-tight lg:leading-[1.3] left-1/2 transform -translate-x-1/2 bg-[#e9e0d4] px-3 font-figtree rounded-t-lg">
                    {formatDate(item.createdAt)}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-[18px] sm:text-[21px] md:text-[23px] lg:text-[25px] xl:text-[25px] leading-snug leading-tight text-black-700 px-2 font-figtree">
                  {item.title}
                </h3>

                {/* Read More */}
                <div className="mt-3 flex justify-center items-center">
                  <Link
                    to="/inspiration-board"
                    className="flex items-center gap-2 mx-auto font-figtree text-[16px] sm:text-[18px] transition group no-underline"
                  >
                    <span className="inline-flex font-regular items-center gap-1 text-black text-[16px] sm:text-[18px] no-underline">
                      Read More
                    </span>
                    <span className="text-[#993333] transform transition-transform duration-200 group-hover:translate-x-[5px]">
                      <ArrowRight size={20} strokeWidth={2} />
                    </span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InspirationBoard;
