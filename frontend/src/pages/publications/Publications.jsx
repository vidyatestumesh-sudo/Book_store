import React from "react";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";

const Publications = () => {
    const { data: books = [] } = useFetchAllBooksQuery();

    return (
        <div className="max-w-8xl mx-auto py-0 text-center flex flex-col justify-center items-center px-4">
            <div className="breadcrumb-container w-full text-left mb-0 ml-10 font-figtree font-lite">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb m-0 p-0">
                        <li className="breadcrumb-item">
                            <a href="/" className="text-gray">Home</a>
                        </li>
                        <li className="breadcrumb-item">
                            <a href="/publications" className="!text-gray-600">Publications</a>
                        </li>
                    </ol>
                </nav>
            </div>

            {/* Title Section */}
            <div className="relative inline-block">
                <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug mb-7 mt-8">
                    Publications
                </h1>
                <img
                    src="/motif.webp"
                    alt="feather"
                    className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2"
                />
            </div>

            {/* Books Grid */}
            <div className="grid gap-x-4 gap-y-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full mt-8">
                {books.map((book, index) => (
                    <div
                        key={index}
                        className="group relative bg-white overflow-hidden transition-all duration-500"
                    >
                        {/* Book Cover */}
                        <Link to={`/books/${book._id}`}>
                            <div className="relative w-full aspect-[2/3] max-w-[300px] mx-auto overflow-hidden group">
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
                                        e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)";
                                        e.currentTarget.firstChild.style.opacity = "1";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "rgba(0,0,0,0)";
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

                        {/* Info Section */}
                        <div className="text-center mt-4 px-12">
                            <h3 className="text-lg md:text-xl font-medium text-gray-700 mb-2 font-figtree break-words">
                                {book?.title}
                            </h3>
                            <div className="inline-flex justify-center items-center gap-3 w-full">
                                <span className="text-gray-500 line-through text-base md:text-lg font-figtree font-lite">
                                    ₹{book?.oldPrice}
                                </span>
                                <span className="text-[#993333] font-lite text-lg md:text-xl font-figtree">
                                    ₹{book?.newPrice}
                                </span>
                                {book?.oldPrice > book?.newPrice && (
                                    <span className="text-sm md:text-lg bg-[#993333] text-white px-1 py-0 font-figtree font-lite">
                                        {Math.round(
                                            ((book.oldPrice - book.newPrice) / book.oldPrice) * 100
                                        )}
                                        % off
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Publications;
