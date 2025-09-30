import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";

const ReadersFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(2); // default 2

  // Use dynamic backend URL
  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://bookstore-backend-hshq.onrender.com"
      : "http://localhost:5000";

  // Handle responsive itemsPerPage
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1); // mobile: show 1
      } else {
        setItemsPerPage(2); // desktop/tablet: show 2
      }
    };

    updateItemsPerPage(); // run on mount
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${BASE_URL}/api/reviews/all?approved=true`
        );

        let reviewsArray = [];
        if (Array.isArray(response.data)) {
          reviewsArray = response.data;
        } else if (Array.isArray(response.data.reviews)) {
          reviewsArray = response.data.reviews;
        }

        setFeedbacks(reviewsArray);
        setCurrentIndex(0);
      } catch (err) {
        setError("Failed to load feedback.");
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [BASE_URL]);

  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - itemsPerPage;
      return newIndex < 0 ? (totalPages - 1) * itemsPerPage : newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + itemsPerPage;
      return newIndex >= feedbacks.length ? 0 : newIndex;
    });
  };

  const currentPage = Math.floor(currentIndex / itemsPerPage) + 1;

  return (
    <div className="bg-white font-playfair mt-0 mb-2">
      <div className="w-full max-w-8xl mx-auto pb-5 px-14 xl:px-14">
        {/* Heading */}
        <div className="relative mb-10 inline-block text-left">
          <h2 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mb-2 mt-0">
            Readers Feedback
          </h2>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-3 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15]"
          />
        </div>

        {/* Loading or Error */}
        {loading && (
          <p className="text-center text-black text-lg font-figtree">
            Loading feedback...
          </p>
        )}
        {error && (
          <p className="text-center text-red-600 text-lg font-figtree">{error}</p>
        )}

        {/* Feedback Cards */}
        {!loading && !error && feedbacks.length === 0 && (
          <p className="text-center text-black text-lg font-figtree">
            No feedback available.
          </p>
        )}

        {!loading && !error && feedbacks.length > 0 && Array.isArray(feedbacks) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-32 text-left mt-0 gap-8 h-auto">
            {feedbacks
              .slice(currentIndex, currentIndex + itemsPerPage)
              .map((fb) => (
                <div key={fb._id || fb.id} className="space-y-4">
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 overflow-hidden rounded-full bg-[#993333] text-white flex items-center justify-center">
                      <img
                        src="/readers.webp"
                        alt={fb.userName || fb.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <span className="italic text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[24px] font-Figtree font-regular leading-snug leading-tight text-black-900 font-figtree break-words">
                      {fb.userName || fb.name}
                    </span>

                    <div className="flex items-center text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[24px] gap-1 mt-0 mb-0">
                      {Array.from({ length: fb.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-500">
                          ★
                        </span>
                      ))}
                      {Array.from({ length: 5 - fb.rating }).map((_, i) => (
                        <span key={i} className="text-gray-300">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <p className="text-left text-[16px] sm:text-[18px] md:text-[18px] lg:text-[20px] xl:text-[20px] text-black-800 font-Figtree font-regular leading-tight lg:leading-[1.3]">
                    {fb.comment || fb.text}
                  </p>

                  {/* Book Name */}
                  {fb.bookName && (
                    <p className="text-right text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px] text-gray-600 italic font-Figtree mt-2 md:mt-0">
                      - {fb.bookName}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Controls */}
        {!loading && !error && feedbacks.length > 0 && (
          <div className="mt-12 flex items-center justify-center sm:justify-start gap-4 font-figtree text-black-800 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-snug lg:leading-normal">
            <button
              onClick={handlePrev}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition"
            >
              <FiChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition"
            >
              <FiChevronRight size={20} />
            </button>

            <span className="text-gray-700 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[21px] xl:text-[22px] font-Figtree font-regular leading-snug leading-tigh font-figtree">
              {String(currentPage).padStart(2, "0")} /{" "}
              {String(totalPages).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadersFeedback;
