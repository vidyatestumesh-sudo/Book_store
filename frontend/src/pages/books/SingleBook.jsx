import "./SingleBook.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useFetchBookByIdQuery } from "../../redux/features/books/booksApi";
import { getImgUrl } from "../../utils/getImgUrl";
// import { useAuth } from "../../context/AuthContext";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

const SingleBook = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError } = useFetchBookByIdQuery(id);
  const dispatch = useDispatch();
  // const { currentUser } = useAuth();

  const [showMore, setShowMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

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

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError || !book)
    return <div className="error">Failed to load book details.</div>;

  return (
    <div className="container">
      {/* Breadcrumb */}
      <div className="breadcrumb-container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/publications">Publications</a>
            </li>
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
              <button
                className="add-to-cart"
                onClick={() => handleAddToCart(book)}>
                ADD TO CART
              </button>
              <button className="buy-now">BUY NOW</button>
            </div>
          </div>

          {/* About Section */}
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

          {/* Description with read more */}
          <p className="book-desc">
            {shortText}
            {showMore && <span className="extra-text"> {longText}</span>}
            <br />
            {words.length > WORD_LIMIT && (
              <span
                className="read-more"
                onClick={() => setShowMore(!showMore)}>
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

          {/* Book Meta */}
          <div className="book-meta">
            <div className="row">
              <div className="col-lg-3 col-md-4 col-sm-4 col-4 label">
                Author
              </div>
              <div className="col-lg-9 col-md-8 col-sm-8 col-8 value">
                {book.author}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3 col-md-4 col-sm-4 col-4 label">
                Specifications
              </div>
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

          {/* Delivery */}
          <div className="delivery">
            <p>Delivery</p>
            <input type="text" placeholder="Enter Delivery Pincode" />
            <button className="check-btn">Check</button>
          </div>

          {/* Share */}
          <div className="share">
            <a>
              <ShareOutlinedIcon className="share-icon" />
              Share
            </a>
          </div>
        </div>
      </div>

      {/* Recently Viewed (Dynamic) */}
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
