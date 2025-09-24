import { useState } from "react";
import Slider from "react-slick";
import "./inspirationboard.css";
import "../../books/SingleBook.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import image1 from "./inspiration-images/from-good-to-great.webp";
import image2 from "./inspiration-images/magic-of-gratitude.webp";
import image3 from "./inspiration-images/presence.webp";
import inspirationAtm from "./inspiration-images/inspiration-atm.webp";
import inspirationBridge from "./inspiration-images/inspiration-bridge.webp";
import inspirationCandle from "./inspiration-images/inspiration-candle.webp";
import inspirationDesire from "./inspiration-images/inspiration-desire.webp";
import inspirationDoorofJoy from "./inspiration-images/inspiration-door-of-joy.webp";
import inspirationEgo from "./inspiration-images/inspiration-ego.webp";

// Top carousel data (image + text)
const inspirationDataTop = [
  { image: image1, title: "From Good To Great" },
  { image: image2, title: "The Magic of Gratitude" },
  { image: image3, title: "Presence" },
];

// Bottom carousel data (images only)
const inspirationDataBottom = [
  { image: inspirationAtm },
  { image: inspirationBridge },
  { image: inspirationCandle },
  { image: inspirationDesire },
  { image: inspirationDoorofJoy },
  { image: inspirationEgo },
];

const InspirationBoard = () => {
  // Top carousel
  const [topSliderRef, setTopSliderRef] = useState(null);
  const [topSlide, setTopSlide] = useState(0);

  const topSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (oldIndex, newIndex) => setTopSlide(newIndex),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  // Bottom carousel
  const [bottomSliderRef, setBottomSliderRef] = useState(null);
  const [bottomSlide, setBottomSlide] = useState(0);

  const bottomSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (oldIndex, newIndex) => setBottomSlide(newIndex),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

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
            {inspirationDataTop.map((item, index) => (
              <div
                className="inspiration-board-carousel-item with-text"
                key={index}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="inspiration-board-carousel-img inspiration-board-carousel-image1"
                />
                <div className="inspiration-board-carousel-text">
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
          </Slider>

          {/* Custom navigation below top carousel */}
          <div className="inspiration-board-custom-nav">
            <button
              className="inspiration-board-nav-btn"
              onClick={() => topSliderRef.slickPrev()}>
              <FiArrowLeft className="inspiration-board-nav-btn-icon" />
            </button>
            <button
              className="inspiration-board-nav-btn"
              onClick={() => topSliderRef.slickNext()}>
              <FiArrowRight className="inspiration-board-nav-btn-icon" />
            </button>
            <span className="inspiration-board-slide-counter">
              {String(topSlide + 1).padStart(2, "0")} /{" "}
              {String(inspirationDataTop.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Bottom Carousel */}
        <div className="inspiration-board-bottom-carousel">
          <Slider ref={setBottomSliderRef} {...bottomSettings}>
            {inspirationDataBottom.map((item, index) => (
              <div
                className="inspiration-board-carousel-item images-only"
                key={index}>
                <img
                  src={item.image}
                  alt={`Slide ${index + 1}`}
                  className="inspiration-board-carousel-img inspiration-board-carousel-image2"
                />
              </div>
            ))}
          </Slider>

          {/* Custom navigation below bottom carousel */}
          <div className="inspiration-board-custom-nav">
            <button
              className="inspiration-board-nav-btn "
              onClick={() => bottomSliderRef.slickPrev()}>
              <FiArrowLeft className="inspiration-board-nav-btn-icon" />
            </button>
            <button
              className="inspiration-board-nav-btn"
              onClick={() => bottomSliderRef.slickNext()}>
              <FiArrowRight className="inspiration-board-nav-btn-icon" />
            </button>
            <span className="inspiration-board-slide-counter">
              {String(bottomSlide + 1).padStart(2, "0")} /{" "}
              {String(inspirationDataBottom.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspirationBoard;
