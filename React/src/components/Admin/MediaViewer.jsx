import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MediaViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mediaItem, mediaList, vehicleId } = location.state || {};

  if (!mediaItem || !mediaList || !vehicleId) {
    return <div className="text-white text-center p-6">Media not found</div>;
  }

  const currentIndex = mediaList.findIndex((item) => item.id === mediaItem.id);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % mediaList.length;
    navigate("/media-viewer", { state: { mediaItem: mediaList[nextIndex], mediaList, vehicleId } });
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + mediaList.length) % mediaList.length;
    navigate("/media-viewer", { state: { mediaItem: mediaList[prevIndex], mediaList, vehicleId } });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black relative text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/vehicle/${vehicleId}`)}
        className="absolute top-5 left-5 text-lg bg-gray-800 bg-opacity-75 px-4 py-2 rounded-lg hover:bg-gray-700 shadow-lg transition duration-300 flex items-center space-x-2"
      >
        <span>&larr;</span>
        <span>Back</span>
      </button>

      {/* Previous Media Button */}
      <button
        onClick={handlePrev}
        className="absolute left-10 text-3xl bg-gray-800 bg-opacity-75 p-3 rounded-full hover:bg-gray-700 shadow-lg transition duration-300"
        title="Previous Media"
      >
        &#8592;
      </button>

      {/* Media Display */}
      <div className="flex flex-col items-center">
        <img
          src={`http://127.0.0.1:8000/storage/${mediaItem.file_path}`}
          alt={`Full view of ${mediaItem.file_path}`}
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
        />
        <p className="mt-4 text-sm text-gray-400">
          {currentIndex + 1} of {mediaList.length}
        </p>
      </div>

      {/* Next Media Button */}
      <button
        onClick={handleNext}
        className="absolute right-10 text-3xl bg-gray-800 bg-opacity-75 p-3 rounded-full hover:bg-gray-700 shadow-lg transition duration-300"
        title="Next Media"
      >
        &#8594;
      </button>
    </div>
  );
};

export default MediaViewer;
