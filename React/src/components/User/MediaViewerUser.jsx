import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MediaViewerUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mediaItem, mediaList, vehicleId } = location.state || {};

  // State for managing the fade-in effect
  const [fadeIn, setFadeIn] = useState(false);

  // Check if the mediaItem, mediaList, and vehicleId are available
  if (!mediaItem || !mediaList || !vehicleId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-lg">Media not found</div>
      </div>
    );
  }

  const currentIndex = mediaList.findIndex((item) => item.id === mediaItem.id);

  // Function to handle the next image
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % mediaList.length;
    navigate("/user-media-viewer", {
      state: { mediaItem: mediaList[nextIndex], mediaList, vehicleId },
    });
    setFadeIn(false); // Reset fade effect
  };

  // Function to handle the previous image
  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + mediaList.length) % mediaList.length;
    navigate("/user-media-viewer", {
      state: { mediaItem: mediaList[prevIndex], mediaList, vehicleId },
    });
    setFadeIn(false); // Reset fade effect
  };

  // Handle keydown event for arrow keys
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrev();
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeydown);

    // Clean up the event listener
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [mediaItem, mediaList]);

  // Trigger fade-in effect when the image changes
  useEffect(() => {
    setFadeIn(true);
  }, [mediaItem]);

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-black">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/buy/${vehicleId}`)}
        className="absolute top-5 left-5 text-white text-lg bg-opacity-70 p-3 rounded-full hover:bg-opacity-90 transition-all transform hover:scale-110"
      >
        &larr; Back
      </button>

      {/* Left Arrow Button */}
      <button
        onClick={handlePrev}
        className="absolute left-10 text-white text-4xl bg-opacity-70 p-3 rounded-full hover:bg-opacity-90 transition-all transform hover:scale-110"
      >
        &#8592;
      </button>

      {/* Image with smooth fade-in and scale effect */}
      <div className="max-w-screen-lg w-full h-full flex items-center justify-center px-4">
        <img
          src={`http://127.0.0.1:8000/storage/${mediaItem.file_path}`}
          alt={`Full view of ${mediaItem.file_path}`}
          className={`max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg border-4 border-gray-600 transition-all duration-500 transform ${fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          onLoad={() => setFadeIn(true)} // Trigger the fade-in effect when the image is loaded
        />
      </div>

      {/* Right Arrow Button */}
      <button
        onClick={handleNext}
        className="absolute right-10 text-white text-4xl bg-opacity-70 p-3 rounded-full hover:bg-opacity-90 transition-all transform hover:scale-110"
      >
        &#8594;
      </button>
    </div>
  );
};

export default MediaViewerUser;
