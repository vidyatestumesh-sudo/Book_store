import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Backend URL

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("/api/reviews/admin");
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();

    socket.on("newReview", (review) => {
      Swal.fire({
        title: "New Review Submitted!",
        html: `<b>${review.userName}</b> rated ${review.rating} stars<br>${review.comment}<br>Book: ${review.bookName || "Unknown"}`,
        icon: "info",
      });

      // Add isNew flag for highlighting
      setReviews((prev) => [{ ...review, isNew: true }, ...prev]);

      // Remove highlight after 5 seconds
      setTimeout(() => {
        setReviews((prev) =>
          prev.map((r) => (r._id === review._id ? { ...r, isNew: false } : r))
        );
      }, 5000);
    });


    return () => socket.off("newReview");
  }, []);

  const toggleApproval = async (id, approved) => {
    const confirm = await Swal.fire({
      title: approved ? "Unapprove Review?" : "Approve Review?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: approved ? "Yes, unapprove" : "Yes, approve",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.patch(`/api/reviews/${id}/approve`, { approved: !approved });
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? res.data.review : r))
      );
      Swal.fire("Success", approved ? "Review unapproved." : "Review approved.", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to update review", "error");
    }
  };

  return (
    <div className="container mt-[100px]">
      <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-[6px] px-2 py-1 shadow-md transition-transform transform hover:scale-105"
          >
            <ArrowBackIcon className="w-4 h-4" />
            Back
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center flex-1">
            Manage Reviews
          </h2>
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews found.</p>
        ) : (
          <div className="flex flex-col space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className={`p-4 border rounded-lg flex justify-between items-center hover:shadow-md transition
        ${review.isNew ? "border-yellow-500 bg-yellow-50" : ""}`}
              >
                <div>
                  <p className="font-semibold">{review.userName}</p>
                  <p className="text-gray-700 italic">{review.comment}</p>
                  <p className="text-sm text-gray-500 italic mt-1">
                    Book: {review.bookName || "Unknown"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-500">★</span>
                    ))}
                    {Array.from({ length: 5 - review.rating }).map((_, i) => (
                      <span key={i} className="text-gray-300">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{review.approved ? "Approved" : "Not Approved"}</p>
                </div>
                <button
                  onClick={() => toggleApproval(review._id, review.approved)}
                  className={`px-4 py-2 rounded text-white font-medium shadow-md transition-transform transform hover:scale-105 ${review.approved ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                    }`}
                >
                  {review.approved ? "Unapprove" : "Approve"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReviews;
