import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import image1 from "../../assets/website/1.jpg";
import image2 from "../../assets/website/2.jpg";
import image3 from "../../assets/website/3.jpg";
import image4 from "../../assets/website/4.jpg";
import image5 from "../../assets/website/5.jpg";
import image6 from "../../assets/website/6.jpg";

import "./AppStoreBanner.css";

const AppStoreBanner = () => {
  const images = [image1, image2, image3, image4, image5, image6];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change slide every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="slider-container">
      <div
        className="slider-image"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      />
      <div className="slider-buttons">
        <button onClick={prevSlide} className="slider-btn prev">
          <FaArrowLeft />
        </button>
        <button onClick={nextSlide} className="slider-btn next">
          <FaArrowRight />
        </button>
      </div>
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default AppStoreBanner;
