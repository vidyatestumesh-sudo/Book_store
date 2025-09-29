import { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "./inspirationboard.css";
import "../../books/SingleBook.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const BACKEND_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://bookstore-backend-hshq.onrender.com";

const InspirationBoard = () => {
  // Top carousel (blogs)
  const [topSliderRef, setTopSliderRef] = useState(null);
  const [topSlide, setTopSlide] = useState(0);
  const [inspirationBlogs, setInspirationBlogs] = useState([]);

  // Bottom carousel (images)
  const [bottomSliderRef, setBottomSliderRef] = useState(null);
  const [bottomSlide, setBottomSlide] = useState(0);
  const [inspirationImages, setInspirationImages] = useState([]);

  // Top carousel settings
  const topSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_, next) => setTopSlide(next),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  // Bottom carousel settings
  const bottomSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_, next) => setBottomSlide(next),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  // Fetch blogs of type "inspiration"
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
        const data = await res.json();
        const filtered = data
          .filter((b) => b.type === "inspiration" && !b.suspended)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setInspirationBlogs(filtered);
      } catch (error) {
        console.error("Error fetching inspiration blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  // Fetch inspiration images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/inspiration-images`);
        const data = await res.json();
        setInspirationImages(data);
      } catch (error) {
        console.error("Error fetching inspiration images:", error);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="inspiration-board">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="breadcrumb-container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/blogs">Blogs</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Inspiration Board
              </li>
            </ol>
          </nav>
        </div>

        {/* Section header */}
        <div className="inspiration-board-header">
          <h2>Inspiration</h2>
          <span>Uplift your spirit</span>
        </div>

        {/* Top Carousel */}
        <div className="inspiration-board-top-carousel">
          <Slider ref={setTopSliderRef} {...topSettings}>
            {inspirationBlogs.map((item, index) => (
              <div
                className="inspiration-board-carousel-item with-text"
                key={item._id || index}
              >
                <Link to={`/inspiration/${item._id}`} className="block group">
                  <img
                    src={
                      item.image?.startsWith("http")
                        ? item.image
                        : `${BACKEND_BASE_URL}${item.image}`
                    }
                    alt={item.title}
                    style={{ width: "100%", height: "380px", objectFit: "cover", borderRadius: "8px", transition: "transform 0.3s", }}
                    className="group-hover:scale-[1.02]"
                  />
                </Link>
              </div>
            ))}
          </Slider>

          {/* Custom navigation below top carousel */}
          <div className="inspiration-board-custom-nav ms-3">
            <button
              className="inspiration-board-nav-btn"
              onClick={() => topSliderRef?.slickPrev()}
            >
              <FiArrowLeft className="inspiration-board-nav-btn-icon" />
            </button>
            <button
              className="inspiration-board-nav-btn"
              onClick={() => topSliderRef?.slickNext()}
            >
              <FiArrowRight className="inspiration-board-nav-btn-icon" />
            </button>
            <span className="inspiration-board-slide-counter">
              {String(topSlide + 1).padStart(2, "0")} /{" "}
              {String(inspirationBlogs.length).padStart(2, "0")}
            </span>
          </div>
        </div>


        {/* Bottom Carousel */}
        <div className="inspiration-board-bottom-carousel">
          <Slider ref={setBottomSliderRef} {...bottomSettings}>
            {inspirationImages.map((item, index) => (
              <div
                className="inspiration-board-carousel-item images-only"
                key={item._id || index}
              >
                <img
                  src={
                    item.imageUrl?.startsWith("http")
                      ? item.imageUrl
                      : `${BACKEND_BASE_URL}${item.imageUrl}`
                  }
                  alt={`Slide ${index + 1}`}
                  className="w-full h-56 md:h-64 lg:h-72 xl:h-74 object-cover rounded-[8px]"
                />
              </div>
            ))}
          </Slider>

          {/* Custom navigation below bottom carousel */}
          <div className="inspiration-board-custom-nav ms-3">
            <button
              className="inspiration-board-nav-btn"
              onClick={() => bottomSliderRef?.slickPrev()}
            >
              <FiArrowLeft className="inspiration-board-nav-btn-icon" />
            </button>
            <button
              className="inspiration-board-nav-btn"
              onClick={() => bottomSliderRef?.slickNext()}
            >
              <FiArrowRight className="inspiration-board-nav-btn-icon" />
            </button>
            <span className="inspiration-board-slide-counter">
              {String(bottomSlide + 1).padStart(2, "0")} /{" "}
              {String(inspirationImages.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspirationBoard;
