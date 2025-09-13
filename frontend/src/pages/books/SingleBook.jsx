import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFetchBookByIdQuery } from "../../redux/features/books/booksApi";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { getImgUrl } from "../../utils/getImgUrl";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const SingleBook = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError, refetch } = useFetchBookByIdQuery(id);
  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const { currentUser } = useAuth();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://bookstore-backend-hshq.onrender.com/api/books/${id}/review`, {
        user: currentUser?.displayName || currentUser?.email || "Anonymous",
        rating,
        comment,
      });
      setRating(0);
      setComment("");
      refetch();
      alert("Review submitted!");
    } catch (error) {
      console.error("Failed to submit review", error);
      alert("Failed to submit review");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load book details.
      </div>
    );

  const reviews = book.reviews || [];
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
      : 0;

  // ✅ Render stars with half-star support
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          if (rating >= star) {
            return <FaStar key={star} className="text-yellow-500 text-2xl" />;
          } else if (rating >= star - 0.5) {
            return (
              <FaStarHalfAlt key={star} className="text-yellow-500 text-2xl" />
            );
          } else {
            return <FaRegStar key={star} className="text-gray-300 text-2xl" />;
          }
        })}
      </div>
    );
  };

  // Reviews to display (2 recent or all)
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 font-['Poppins']">
      {/* 🔹 Book details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative group overflow-hidden w-[22rem] md:ml-12 mx-auto rounded-xl shadow-xl">
          <img
            src={getImgUrl(book.coverImage)}
            alt={book.title}
            className="rounded-xl object-cover w-full h-auto"
          />
        </div>
        <div className="space-y-6 md:-ml-10">
          <h1 className="text-4xl font-extrabold">{book.title}</h1>
          <p>
            <span className="font-semibold">Author:</span> {book.author}
          </p>
          <p>
            <span className="font-semibold">Published:</span>{" "}
            {new Date(book.createdAt).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {book.description}
          </p>
          <p className="text-lg flex items-center gap-2">
            <span className="font-semibold">Price:</span>
            <span className="text-green-600 font-bold">₹{book?.newPrice}</span>
            <span className="text-gray-400 line-through">₹{book?.oldPrice}</span>
            {book?.oldPrice > book?.newPrice && (
              <span className="text-red-500 font-semibold">
                {Math.round(
                  ((book.oldPrice - book.newPrice) / book.oldPrice) * 100
                )}
                % OFF
              </span>
            )}
          </p>
          <button
            onClick={() => handleAddToCart(book)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full"
          >
            <FiShoppingCart className="inline-block mr-2" /> Add to Cart
          </button>
        </div>
      </div>

      {/* 🔹 Reviews Section */}
      <div className="mt-16">
        {/* Header with overall rating */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold flex items-center gap-4">
            Customer Reviews
            {reviews.length > 0 && (
              <span className="flex items-center gap-2 text-lg bg-gray-100 px-4 py-2 rounded-lg shadow">
                {renderStars(avgRating)}
                <span className="text-gray-800 font-semibold">
                  {avgRating.toFixed(1)} / 5 ({reviews.length})
                </span>
              </span>
            )}
          </h2>
        </div>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4 transition-all duration-500 ease-in-out">
            {displayedReviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition transform hover:-translate-y-1"
              >
                <p className="font-semibold text-gray-800">{rev.user}</p>
                {renderStars(rev.rating)}
                <p className="text-gray-600 mt-1">{rev.comment}</p>
              </div>
            ))}

            {/* Read more/less button */}
            {reviews.length > 2 && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-blue-600 font-semibold hover:underline mt-2 transition"
              >
                {showAllReviews ? "Read Less" : "Read More Reviews"}
              </button>
            )}
          </div>
        ) : (
          <p>No reviews yet.</p>
        )}

        {/* Add Review */}
        {currentUser ? (
          <form
            onSubmit={handleReviewSubmit}
            className="mt-10 space-y-4 bg-gray-50 p-6 rounded-xl shadow-md transition hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold">Leave a Review</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-3xl transition-transform transform hover:scale-110 ${
                    star <= rating ? "text-yellow-600" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none transition"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <p className="mt-4 text-gray-600">Please log in to leave a review.</p>
        )}
      </div>
    </div>
  );
};

export default SingleBook;
