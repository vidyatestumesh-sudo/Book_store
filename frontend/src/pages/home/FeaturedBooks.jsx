import React, { useState, useEffect, useRef } from "react";
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
  const [itemsPerView, setItemsPerView] = useState(4);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const scrollContainerRef = useRef(null);

  const handleAddToCart = (book) => {
    dispatch(addToCart(book));
  };

  useEffect(() => {
    const updateView = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

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

    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

  useEffect(() => {
    if (startIndex + itemsPerView > books.length) {
      setStartIndex(Math.max(books.length - itemsPerView, 0));
    }
  }, [books.length, itemsPerView, startIndex]);

  // Scroll width of one book card (including padding/margin)
  const getScrollAmount = () => {
    if (!scrollContainerRef.current) return 0;
    const container = scrollContainerRef.current;
    const firstBook = container.querySelector("div > div > div");
    if (!firstBook) return 0;
    return firstBook.offsetWidth + 16; // 16px = 8px padding left + 8px right (adjust if needed)
  };

  const handleNext = () => {
    if (windowWidth > 1024) {
      // Desktop: slide by changing startIndex
      if (startIndex + itemsPerView < books.length) {
        setStartIndex((prev) => Math.min(prev + 1, books.length - itemsPerView));
      }
    } else {
      // Mobile: scroll container by one item
      if (scrollContainerRef.current) {
        const scrollAmount = getScrollAmount();
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const handlePrev = () => {
    if (windowWidth > 1024) {
      // Desktop: slide by changing startIndex
      setStartIndex((prev) => Math.max(prev - 1, 0));
    } else {
      // Mobile: scroll container by one item left
      if (scrollContainerRef.current) {
        const scrollAmount = getScrollAmount();
        scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-2 text-center flex flex-col justify-center items-center px-4">
      {/* Title Section */}
      <div className="relative inline-block">
        <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug mb-7 mt-8">
          Featured Books
        </h1>
        <img
          src="/motif.webp"
          alt="feather"
          className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-14 sm:w-16 md:w-20 lg:w-24 h-auto [opacity:0.15] mb-4"
        />
      </div>

      {/* Slider Container */}
      <div className="relative w-full flex items-center mt-8">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          disabled={windowWidth > 1024 ? startIndex === 0 : false} // disable on desktop if at start
          className={`absolute left-0 z-10 text-gray-900 opacity-70 hover:opacity-100 transition
            -translate-y-1/2 translate-x-[-20%] sm:translate-x-[-40%] 2xl:translate-x-[-70%] ${windowWidth > 1024 && startIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
            }`}
          style={{
            top: windowWidth > 1024 ? "220px" : "40%",
            touchAction: "manipulation",
            transform: windowWidth <= 1024 ? "translateY(-50%)" : undefined,
          }}
          aria-label="Previous books"
        >
          <FiChevronLeft size={windowWidth > 1024 ? 80 : 40} />
        </button>

        {/* Slider Track */}
        <div
          ref={scrollContainerRef}
          className={`w-full ${windowWidth > 1024 ? "overflow-hidden" : "overflow-x-auto scrollbar-hide"} px-2 sm:px-4`}
          style={windowWidth <= 1024 ? { scrollPaddingLeft: "50px", scrollPaddingRight: "50px" } : {}}
        >
          <div
            className={`flex ${windowWidth > 1024 ? "transition-transform duration-700 ease-in-out" : ""}`}
            style={{
              transform:
                windowWidth > 1024 ? `translateX(-${(startIndex * 100) / itemsPerView}%)` : "none",
            }}
          >
            {books.map((book, index) => (
              <div
                key={index}
                className={`px-2 flex-shrink-0 ${itemsPerView === 4
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
                      {/* Hover overlay (Desktop Only) */}
                      {windowWidth > 1024 && (
                        <div
                          className="absolute inset-0 flex items-center justify-center transition-all duration-500 z-10"
                          style={{
                            backgroundColor: "rgba(0,0,0,0)",
                            transition: "background-color 0.5s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)";
                            e.currentTarget.firstChild.style.opacity = "1";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(0,0,0,0)";
                            e.currentTarget.firstChild.style.opacity = "0";
                          }}
                        >
                          <span
                            className="!text-white !text-lg !font-semibold hover:!text-[#cc6633] !cursor-pointer "
                            style={{
                              opacity: 0,
                              transition: "opacity 0.5s ease",
                            }}
                          >
                            VIEW BOOK
                          </span>
                        </div>
                      )}
                      {/* Border */}
                      <div className="book-border absolute inset-5 z-20 pointer-events-none">
                        <span className="top"></span>
                        <span className="right"></span>
                        <span className="bottom"></span>
                        <span className="left"></span>
                      </div>
                    </div>
                  </Link>

                  {/* Info Section */}
                  <div className="text-center mt-6 px-4">
                    <h3 className="text-lg md:text-xl font-medium text-gray-700 mb-4 font-figtree break-words">
                      {book?.title}
                    </h3>
                    <div className="inline-flex justify-center items-center gap-4 w-full">
                      <span className="text-gray-500 line-through text-base md:text-lg font-figtree font-lite">
                        ₹{book?.oldPrice}
                      </span>
                      <span className="text-[#993333] font-lite text-lg md:text-xl font-figtree">
                        ₹{book?.newPrice}
                      </span>
                      {book?.oldPrice > book?.newPrice && (
                        <span className="text-sm md:text-lg bg-[#993333] text-white px-2 py-0 font-figtree font-lite">
                          {Math.round(
                            ((book.oldPrice - book.newPrice) / book.oldPrice) * 100
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
        <button
          onClick={handleNext}
          disabled={
            windowWidth > 1024
              ? startIndex + itemsPerView >= books.length
              : false
          }
          className={`absolute right-0 z-10 text-gray-900 opacity-70 hover:opacity-100 transition
    -translate-y-1/2 translate-x-[20%] sm:translate-x-[40%] 2xl:translate-x-[70%] ${windowWidth > 1024 && startIndex + itemsPerView >= books.length
              ? "opacity-30 cursor-not-allowed"
              : ""
            }`}
          style={{
            top: windowWidth > 1024 ? "220px" : "40%",
            touchAction: "manipulation",
            transform: windowWidth <= 1024 ? "translateY(-50%)" : undefined,
          }}
          aria-label="Next books"
        >
          <FiChevronRight size={windowWidth > 1024 ? 80 : 40} />
        </button>

      </div>
    </div>
  );
};

export default FeaturedBooks;
