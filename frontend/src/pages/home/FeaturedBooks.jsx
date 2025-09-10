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
    <div className="max-w-6xl mx-auto px-6 py-16 font-Figtree">
      {/* Title */}
      <div className="flex justify-center items-center mb-12 relative">
        <h2 className="text-3xl text-center font-flayfair">Featured Books</h2>
        <img
          src="/motif.webp"
          alt="feather"
          className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 [opacity:0.15]"
        />
      </div>

      {/* Smooth Scroll Container */}
      <div className="relative overflow-hidden ">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${startIndex * 25}%)`,
          }}
        >
          {books.map((book, index) => (
            <div key={index} className="w-1/4 px-3 flex-shrink-0 max-w-5x">
              <div className="group relative bg-white overflow-hidden transition-all duration-500 ">
                {/* Book Cover */}
                <Link to={`/books/${book._id}`}>
                  <div className="relative overflow-hidden w-60 h-85 mx-auto">
                    <img
                      src={getImgUrl(book?.coverImage)}
                      alt={book?.title}
                      className="object-cover w-full h-full"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-500">
                      <span className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition duration-500">
                        VIEW BOOK
                      </span>
                    </div>

                    {/* Animated border */}
                    <div className="book-border">
                      <span className="top"></span>
                      <span className="right"></span>
                      <span className="bottom"></span>
                      <span className="left"></span>
                    </div>
                  </div>
                </Link>

                {/* Info */}
                <div className="text-center mt-3">
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    {book?.title}
                  </h3>
                  <div className="flex justify-center items-center gap-2 text-lg">
                    <span className="line-through text-gray-500">
                      ₹{book?.oldPrice}
                    </span>
                    <span className="text-red-600 font-semibold">
                      ₹{book?.newPrice}
                    </span>
                    {book?.oldPrice > book?.newPrice && (
                      <span className="text-xs bg-red-500 text-white px-2 py-0.5 ">
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

        {/* Left Arrow */}
        {/* {startIndex > 0 && (
  <button
    onClick={handlePrev}
    className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-800"
  >
    <FiChevronLeft size={55} />
  </button>
)}

{/* Right Arrow */}
        {/* {startIndex + 4 < books.length && (
  <button
    onClick={handleNext}
    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-800"
  >
    <FiChevronRight size={55} />
  </button>
)} */}


      </div>
    </div>
  );
};

export default FeaturedBooks;
