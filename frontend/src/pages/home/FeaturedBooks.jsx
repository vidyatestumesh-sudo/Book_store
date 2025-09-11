import React, { useState } from "react";
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

  const handleAddToCart = (book) => {
    dispatch(addToCart(book));
  };

  const handleNext = () => {
    if (startIndex + 4 < books.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-16 text-center flex flex-col justify-center items-center">
      {/* Title Section */}
      <div className="relative inline-block">
        <h1 className="text-[50px] font-playfair font-display leading-snug mb-8 mt-8">
          Featured Books
        </h1>
        <img
          src="/motif.webp"
          alt="feather"
          className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-25 h-28 md:w-28 md:h-22 [opacity:0.15] mb-2"
        />
      </div>

      {/* Wrapper to hold arrows + slider */}
      <div className="relative flex items-center mt-8 max-w-7xl">
        {/* Left Arrow */}
        {startIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-8 z-10 -translate-x-full text-gray-800 [opacity:0.15] mb-24"
          >
            <FiChevronLeft size={70} />
          </button>
        )}

        {/* Smooth Scroll Container */}
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${startIndex * 25}%)`,
            }}
          >
            {books.map((book, index) => (
              <div key={index} className="w-1/4 px-0 flex-shrink-0">
                <div className="group relative bg-white overflow-hidden transition-all duration-500">
                  {/* Book Cover */}
                  <Link to={`/books/${book._id}`}>
                    <div className="relative overflow-hidden w-[290px] h-[450px] mx-auto">
                      <img
                        src={getImgUrl(book?.coverImage)}
                        alt={book?.title}
                        className="object-cover w-full h-full"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-500">
                        <span className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition duration-500 hover:text-[#cc6633] cursor-pointer">
                          VIEW BOOK
                        </span>
                      </div>

                      {/* Animated border */}
                      <div className="book-border absolute inset-5 ">
                        <span className="top"></span>
                        <span className="right"></span>
                        <span className="bottom"></span>
                        <span className="left"></span>
                      </div>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="text-center mt-6 px-8">
                    {/* Title */}
                    <h3 className="text-xl font-medium text-gray-900 mb-4 font-figtree break-words">
                      {book?.title}
                    </h3>

                    {/* Price Section */}
                    <div className="inline-flex justify-center items-center gap-4 w-full">
                      {/* Old Price */}
                      <span className="text-gray-500 line-through text-lg font-figtree">
                        ₹{book?.oldPrice}
                      </span>

                      {/* New Price */}
                      <span className="text-[#993333] font-bold text-xl font-figtree">
                        ₹{book?.newPrice}
                      </span>

                      {/* Discount */}
                      {book?.oldPrice > book?.newPrice && (
                        <span className="text-lg bg-[#993333] text-white px-2 py-0 font-figtree">
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
        {startIndex + 4 < books.length && (
          <button
            onClick={handleNext}
            className="absolute right-8 z-10 translate-x-full text-gray-800 [opacity:0.15] mb-24"
          >
            <FiChevronRight size={70}/>
          </button>
        )}
      </div>
    </div>
  );
};

export default FeaturedBooks;
