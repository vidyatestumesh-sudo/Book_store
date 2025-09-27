import "./SingleBook.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useFetchBookByIdQuery } from "../../redux/features/books/booksApi";
import { getImgUrl } from "../../utils/getImgUrl";
import { useAuth } from "../../context/AuthContext";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { clearCart } from "../../redux/features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

const SingleBook = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError, refetch } = useFetchBookByIdQuery(id);
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [showMore, setShowMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isEditingReview, setIsEditingReview] = useState(false);

  const WORD_LIMIT = 100;
  const words = book?.description?.split(" ") || [];
  const shortText = words.slice(0, WORD_LIMIT).join(" ");
  const longText = words.slice(WORD_LIMIT).join(" ");

  useEffect(() => {
    if (book?._id) {
      let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
      viewed = viewed.filter((b) => b._id !== book._id);
      viewed.unshift(book);
      viewed = viewed.slice(0, 5);
      localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
    }
  }, [book]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const filtered = stored.filter((b) => b._id !== book?._id);
    setRecentlyViewed(filtered.slice(0, 4));
  }, [book]);

  useEffect(() => {
    if (book?.coverImage) {
      setSelectedImage(getImgUrl(book.coverImage));
    }
  }, [book]);

  // Preload current user's review data (if exists)
  useEffect(() => {
    if (book?.reviews && currentUser) {
      const userReview = book.reviews.find((rev) => rev.userId === currentUser.uid);
      if (userReview) {
        setRating(userReview.rating);
        setComment(userReview.comment);
      } else {
        setRating(0);
        setComment("");
      }
    }
  }, [book, currentUser]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleBuyNow = (product) => {
    dispatch(clearCart());
    dispatch(addToCart(product));
    navigate("/checkout");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      alert("Please provide both rating and comment.");
      return;
    }
    if (!currentUser) {
      alert("You must be logged in to submit a review.");
      return;
    }

    try {
      const res = await fetch(`/api/books/${id}/review`, {
        method: "POST", // server handles create or update
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: id,
          userId: currentUser.uid,
          userName: currentUser.displayName || currentUser.email || "Anonymous User",
          rating,
          comment,
        }),
      });

      if (res.ok) {
        setIsEditingReview(false);
        setRating(0);
        setComment("");
        refetch();
      } else {
        const err = await res.json();
        console.error("Failed to submit review:", err);
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  const avgRating =
    book?.reviews?.length > 0
      ? book.reviews.reduce((acc, r) => acc + r.rating, 0) / book.reviews.length
      : 0;

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError || !book) return <div className="error">Failed to load book details.</div>;

  const currentUserReview = book.reviews?.find(
    (rev) => rev.userId === currentUser?.uid
  );
  const otherReviews = book.reviews
    ?.filter((rev) => rev.userId !== currentUser?.uid)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2);

  return (
    <div className="container">
      {/* Breadcrumb */}
      <div className="breadcrumb-container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item"><a href="/publications">Publications</a></li>
            <li className="breadcrumb-item active" aria-current="page">
              {book.title}
            </li>
          </ol>
        </nav>
      </div>

      <div className="row book-section">
        {/* Book Images */}
        <div className="col-lg-4 col-md-12 col-sm-12 col-12">
          <div className="col-lg-12 col-md-8 col-sm-8 col-10 book-images">
            <div className="book-image">
              <div className="book-preview-images">
                {book.coverImage && (
                  <img
                    src={getImgUrl(book.coverImage)}
                    alt="Front View"
                    className="thumb-img"
                    onClick={() => setSelectedImage(getImgUrl(book.coverImage))}
                  />
                )}
                {book.backImage && (
                  <img
                    src={getImgUrl(book.backImage)}
                    alt="Back View"
                    className="thumb-img"
                    onClick={() => setSelectedImage(getImgUrl(book.backImage))}
                  />
                )}
              </div>
              <div className="book-main-image">
                {selectedImage && <img src={selectedImage} alt={book.title} />}
              </div>
            </div>
            <div className="book-buttons">
              <button className="add-to-cart" onClick={() => handleAddToCart(book)}>
                ADD TO CART
              </button>
              <button className="buy-now" onClick={() => handleBuyNow(book)}>
                BUY NOW
              </button>
            </div>
          </div>

          {book.aboutBook && (
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="about-book">
                <h4>About The Book</h4>
                <p>{book.aboutBook}</p>
                <p className="author-sign">
                  Thank you for being,
                  <br />
                  {book.author}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="col-lg-8 col-md-12 col-sm-12 col-12 book-details ">
          <h2>{book.title}</h2>

          <div className="book-rating">
            {Array.from({ length: 5 }, (_, i) => {
              if (i < Math.floor(avgRating)) {
                return <StarIcon key={i} className="star filled" />;
              } else if (i < avgRating) {
                return <StarHalfIcon key={i} className="star half" />;
              } else {
                return <StarBorderIcon key={i} className="star empty" />;
              }
            })}
            <span className="rating-text">
              ({avgRating.toFixed(1)} / 5 from {book?.reviews?.length || 0} reviews)
            </span>
          </div>

          <div className="price">
            <span className="current-price">₹ {book.newPrice}</span>
            <span className="old-price">₹ {book.oldPrice}</span>
            {book.oldPrice > book.newPrice && (
              <span className="discount">
                {Math.round(
                  ((book.oldPrice - book.newPrice) / book.oldPrice) * 100
                )}
                % off
              </span>
            )}
          </div>

          <p className="book-desc">
            {shortText}
            {showMore && <span className="extra-text"> {longText}</span>}
            <br />
            {words.length > WORD_LIMIT && (
              <span className="read-more" onClick={() => setShowMore(!showMore)}>
                {showMore ? (
                  <>
                    <KeyboardArrowUpIcon /> Read less
                  </>
                ) : (
                  <>
                    <KeyboardArrowDownIcon /> Read more
                  </>
                )}
              </span>
            )}
          </p>

          <div className="book-meta">
            <div className="row">
              <div className="col-lg-3 col-md-4 col-sm-4 col-4 label">Author</div>
              <div className="col-lg-9 col-md-8 col-sm-8 col-8 value">{book.author}</div>
            </div>
            <div className="row">
              <div className="col-lg-3 col-md-4 col-sm-4 col-4 label">Specifications</div>
              <div className="col-lg-9 col-md-8 col-sm-8 col-8 value">
                <p>Language: {book.language}</p>
                <p>Binding: {book.binding}</p>
                <p>Publisher: {book.publisher}</p>
                <p>ISBN: {book.isbn}</p>
                <p>Publishing Date: {book.publishingDate}</p>
                <p>Pages: {book.pages}</p>
              </div>
            </div>
          </div>

          <div className="share">
            <a>
              <ShareOutlinedIcon className="share-icon" />
              Share
            </a>
          </div>

          <div className="review-section">
            <h3>Leave a Review</h3>

            {/* If user has a review and not editing, show it read-only with Edit button */}
            {currentUser && currentUserReview && !isEditingReview && (
              <div className="review user-review">
                <div className="review-rating">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={i < currentUserReview.rating ? "star filled" : "star"}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="review-comment">{currentUserReview.comment}</p>
                <button onClick={() => setIsEditingReview(true)}>Edit Review</button>
              </div>
            )}

            {/* Show form if editing or if user hasn't submitted */}
            {(isEditingReview || !currentUserReview) && currentUser && (
              <form onSubmit={handleReviewSubmit}>
                <div className="rating-input">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      onClick={() => setRating(i + 1)}
                      className={i < rating ? "star selected" : "star"}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review..."
                ></textarea>
                <div className="review-buttons">
                  <button type="submit" class="me-3">
                    {currentUserReview ? "Update Review" : "Submit Review"}
                  </button>
                  {isEditingReview && (
                    <button
                      type="button"
                      onClick={() => {
                        // Cancel edit mode
                        setIsEditingReview(false);
                        // Reset comment & rating to existing review if present
                        if (currentUserReview) {
                          setRating(currentUserReview.rating);
                          setComment(currentUserReview.comment);
                        } else {
                          setRating(0);
                          setComment("");
                        }
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}

            <div className="recent-reviews">
              <h4>Recent Reviews</h4>
              {otherReviews && otherReviews.length > 0 ? (
                otherReviews.map((rev, idx) => (
                  <div key={idx} className="review">
                    <div className="review-rating">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={i < rev.rating ? "star filled" : "star"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="review-comment">{rev.comment}</p>
                    <small>- {rev.userName}</small>
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="recently-viewed">
        <h3>Recently Viewed</h3>
        <div className="row">
          {recentlyViewed.length > 0 ? (
            recentlyViewed.map((rv) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-12" key={rv._id}>
                <div className="rv-card">
                  <Link to={`/books/${rv._id}`}>
                    <img src={getImgUrl(rv.coverImage)} alt={rv.title} />
                    <h4>{rv.title}</h4>
                    <p>
                      <span className="old-price">₹ {rv.oldPrice}</span>{" "}
                      <span className="current-price">₹ {rv.newPrice}</span>{" "}
                      {rv.oldPrice > rv.newPrice && (
                        <span className="discount">
                          {Math.round(
                            ((rv.oldPrice - rv.newPrice) / rv.oldPrice) * 100
                          )}
                          % off
                        </span>
                      )}
                    </p>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No recently viewed books yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
