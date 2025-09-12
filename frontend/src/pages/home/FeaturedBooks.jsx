import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { getImgUrl } from "../../utils/getImgUrl";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";

const FeaturedBooks = () => {
  const dispatch = useDispatch();
  const { data: books = [] } = useFetchAllBooksQuery();
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4); // default for desktop

  const handleAddToCart = (book) => {
    dispatch(addToCart(book));
  };

  // 🔹 Adjust items per view based on screen width
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1440) {
        setItemsPerView(4);
      } else if (width >= 1024) {
        setItemsPerView(3);
      } else if (width >= 768) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const handleNext = () => {
    if (startIndex + itemsPerView < books.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-16 text-center flex flex-col justify-center items-center px-4">
      {/* Title Section */}
      <div className="relative inline-block">
        <h1 className="text-[32px] sm:text-[40px] md:text-[50px] font-playfair font-display leading-snug mb-8 mt-8">
          Featured Books
        </h1>
        <img
          src="/motif.webp"
          alt="feather"
          className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-20 md:w-28 h-auto [opacity:0.15] mb-2"
        />
      </div>

      {/* Wrapper for arrows + slider */}
      <div className="relative w-full flex items-center mt-8">
        {/* Left Arrow */}
        {startIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 z-10 -translate-x-full text-gray-800 opacity-40 hover:opacity-70 transition mb-20"
          >
            <FiChevronLeft size={50} />
          </button>
        )}

        {/* Slider */}
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${(startIndex * 100) / itemsPerView}%)`,
            }}
          >
            {books.map((book, index) => (
              <div
                key={index}
                className={`px-2 flex-shrink-0 ${
                  itemsPerView === 4
                    ? "w-1/4"
                    : itemsPerView === 3
                    ? "w-1/3"
                    : itemsPerView === 2
                    ? "w-1/2"
                    : "w-full"
                }`}
              >
                <div className="group relative bg-white overflow-hidden transition-all duration-500">
                  {/* Book Cover */}
                  <Link to={`/books/${book._id}`}>
                    <div className="relative w-full aspect-[2/3] max-w-[290px] mx-auto overflow-hidden group">
                      <img
                        src={getImgUrl(book?.coverImage)}
                        alt={book?.title}
                        className="object-cover w-full h-full z-0"
                      />
                      {/* Hover overlay */}
                      <div
                        className="absolute inset-0 flex items-center justify-center transition-all duration-500 z-10"
                        style={{
                          backgroundColor: "rgba(0,0,0,0)",
                          transition: "background-color 0.5s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(0,0,0,0.5)";
                          e.currentTarget.firstChild.style.opacity = "1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(0,0,0,0)";
                          e.currentTarget.firstChild.style.opacity = "0";
                        }}
                      >
                        <span
                          className="!text-white !text-lg !font-semibold hover:!text-[#cc6633] !cursor-pointer"
                          style={{
                            opacity: 0,
                            transition: "opacity 0.5s ease",
                          }}
                        >
                          VIEW BOOK
                        </span>
                      </div>
                      {/* Border */}
                      <div className="book-border absolute inset-5 z-20 pointer-events-none">
                        <span className="top"></span>
                        <span className="right"></span>
                        <span className="bottom"></span>
                        <span className="left"></span>
                      </div>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="text-center mt-6 px-4">
                    <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-4 font-figtree break-words">
                      {book?.title}
                    </h3>

                    {/* Price Section */}
                    <div className="inline-flex justify-center items-center gap-4 w-full">
                      <span className="text-gray-500 line-through text-base md:text-lg font-figtree">
                        ₹{book?.oldPrice}
                      </span>
                      <span className="text-[#993333] font-bold text-lg md:text-xl font-figtree">
                        ₹{book?.newPrice}
                      </span>
                      {book?.oldPrice > book?.newPrice && (
                        <span className="text-sm md:text-lg bg-[#993333] text-white px-2 py-0 font-figtree ">
                          {Math.round(
                            ((book.oldPrice - book.newPrice) / book.oldPrice) *
                              100
                          )}
                          % off
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        {startIndex + itemsPerView < books.length && (
          <button
            onClick={handleNext}
            className="absolute right-0 z-10 translate-x-full text-gray-800 opacity-40 hover:opacity-70 transition mb-20"
          >
            <FiChevronRight size={50} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FeaturedBooks;
