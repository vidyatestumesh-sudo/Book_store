import "./SingleBook.css";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import bookMain from "../../assets/books/the-attributes-of-a-virtuous-mindset.webp";
import book1 from "../../assets/books/goodbye-mr-patel-1.webp";
import book2 from "../../assets/books/gentle-breeze-of-daily-wisdom.webp";
import book3 from "../../assets/books/the-attributes-of-a-virtuous-mindset.webp";
import book4 from "../../assets/books/master-the-rules-of-manifestation.webp";
import bookBack from "../../assets/books/back-the-attributes-of-a-virtuous-mindset.webp";

const SingleBook = () => {
  // state for read more
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="container">
      {/* Breadcrumb (separate container) */}
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
              The Attributes of A Virtuous Mindset
            </li>
          </ol>
        </nav>
      </div>

      <div className="row book-section">
        {/* Book Image + Buttons */}
        <div className="col-lg-4 col-md-12 col-sm-12 col-12">
          <div className="col-lg-12 col-md-8 col-sm-8 col-10 book-images">
            <div className="book-image">
              <div className="book-preview-images">
                <img src={bookMain} alt="Front View" className="thumb-img" />
                <img src={bookBack} alt="Back View" className="thumb-img" />
              </div>
              <div className="book-main-image">
                <img
                  src={bookMain}
                  alt="The Attributes of A Virtuous Mindset"
                />
              </div>
            </div>
            <div className="book-buttons">
              <button className="add-to-cart">ADD TO CART</button>
              <button className="buy-now">BUY NOW</button>
            </div>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="about-book">
              <h4>About The Book</h4>
              <p>
                You and I are one, so I urge you to read it as if you wrote it.
                Recite and mull over what touches you. Leave the rest. Your
                subconscious mind will take you back to when the time is right.
                The tide of right time comes at some point, and with it comes
                the wisdom that peels off the layers of illusory ornamental
                adornments that conceal the divine truth about you.
              </p>
              <p className="author-sign">
                Thank you for being,
                <br />
                Anil Kumar
              </p>
            </div>
          </div>
        </div>

        {/* Book Details */}
        <div className="col-lg-8 col-md-12 col-sm-12 col-12 book-details ">
          <h2>The Attributes of A Virtuous Mindset</h2>
          <div className="price">
            <span className="current-price">₹ 200</span>
            <span className="old-price">₹ 400</span>
            <span className="discount">50% off</span>
          </div>
          {/* Book description with toggle */}
          <p className="book-desc">
            This book will remind you that we are spirit beings masquerading as
            humans. The author believes that the modern man is so caught up in
            making a living that he has no time to truly and deeply think about
            life where he’s come from and where he’s heading. His shallow living
            with murky intentions, self-centeredness, and compulsion to
            perpetually engage in social networking, so as not to feel isolated,
            leave no time or energy for him to think at a deeper level. The
            result is frustration, confusion, and inner conflict.
            {showMore && (
              <>
                <br />
                <p className="extra-text">
                  The journey towards a virtuous mindset is not a one-time
                  effort but a continuous practice. Each day offers
                  opportunities to cultivate patience, humility, gratitude, and
                  compassion. These qualities are not abstract ideals; they are
                  practical tools that shape how we respond to challenges,
                  interact with others, and nurture our own inner peace.
                  <br />
                  By reflecting on these attributes, the reader begins to notice
                  subtle shifts in perception conflict transforms into
                  understanding, fear gives way to courage, and isolation turns
                  into connection. A virtuous mindset becomes the compass that
                  points us toward a life of meaning and harmony.
                </p>
              </>
            )}
            <br />
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
          </p>

          <div className="book-meta">
            <div className="row">
              <div className="col-lg-3 col-md-4 col-sm-4 col-4 label">
                Author
              </div>
              <div className="col-lg-9 col-md-8 col-sm-8 col-8 value">
                Anil Kumar
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3 col-md-4 col-sm-4 col-4 label">
                Specifications
              </div>
              <div className="col-lg-9 col-md-8 col-sm-8 col-8 value">
                <p>Language: English</p>
                <p>Binding: Paperback</p>
                <p>Publisher: Langshott Leadership Foundation</p>
                <p>ISBN: 978-0-9562690-7-0</p>
                <p>Publishing Date: August 2025</p>
                <p>Pages: 172</p>
              </div>
            </div>
          </div>

          <div className="delivery">
            <p>Delivery</p>
            <input type="text" placeholder="Enter Delivery Pincode" />
            <button className="check-btn">Check</button>
          </div>

          <div className="share">
            <a>
              <ShareOutlinedIcon className="share-icon" />
              Share
            </a>
          </div>
        </div>
      </div>

      {/* Recently Viewed Section */}
      <div className="recently-viewed">
        <h3>Recently Viewed</h3>
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="rv-card">
              <img src={book1} alt="Book" />
              <h4>Good-bye, Mr Patel 1 – The Sequel</h4>
              <p>
                <span className="old-price">₹ 400</span>{" "}
                <span className="current-price">₹ 200</span>{" "}
                <span className="discount">50% off</span>
              </p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="rv-card">
              <img src={book2} alt="Book" />
              <h4>Gentle Breeze of Daily Wisdom</h4>
              <p>
                <span className="old-price">₹ 400</span>{" "}
                <span className="current-price">₹ 200</span>{" "}
                <span className="discount">50% off</span>
              </p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="rv-card">
              <img src={book3} alt="Book" />
              <h4>The Attributes of A Virtuous Mindset</h4>
              <p>
                <span className="old-price">₹ 400</span>{" "}
                <span className="current-price">₹ 200</span>{" "}
                <span className="discount">50% off</span>
              </p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="rv-card">
              <img src={book4} alt="Book" />
              <h4>Master the Rules of Manifestation</h4>
              <p>
                <span className="old-price">₹ 400</span>{" "}
                <span className="current-price">₹ 200</span>{" "}
                <span className="discount">50% off</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
