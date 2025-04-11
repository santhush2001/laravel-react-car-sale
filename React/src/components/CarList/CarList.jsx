import React from "react";
import whiteCar from "../../assets/car2.png";
import car2 from "../../assets/car6.png";
import car3 from "../../assets/van.png";
import car4 from "../../assets/bike.png";
import car5 from "../../assets/bus.png";
import car6 from "../../assets/threeweel.png";
import car7 from "../../assets/lorry-truck.png";
import car8 from "../../assets/double-cab.png";
import car9 from "../../assets/doser.png";

const carList = [
  {
    image: whiteCar,
    category: "Car",
    aosDelay: "0",
  },
  {
    image: car2,
    category: "Jeep",
    aosDelay: "500",
  },
  {
    image: car3,
    category: "Van",
    aosDelay: "1000",
  },
  {
    image: car4,
    category: "Bike",
    aosDelay: "1000",
  },
  {
    image: car5,
    category: "Bus",
    aosDelay: "1000",
  },
  {
    image: car6,
    category: "Three-wheeler",
    aosDelay: "1000",
  },
  {
    image: car7,
    category: "Lorry-Truck",
    aosDelay: "1000",
  },
  {
    image: car8,
    category: "Double-Cab",
    aosDelay: "1000",
  },
  {
    image: car9,
    category: "Dozer",
    aosDelay: "1000",
  },
];

const CarList = () => {
  return (
    <div id="carlist" className="py-16 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/50">
      <div className="container px-4 mx-auto">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1
            data-aos="fade-up"
            className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
          >
            Vehicle Category
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="400"
            className="text-base sm:text-lg text-gray-600 dark:text-gray-300"
          >
            Our website offers sales across all vehicle categories, providing a
            wide range of options to suit every need and preference.
          </p>
        </div>

        {/* Car listing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {carList.map((data) => (
            <div
              key={data.category}
              data-aos="fade-up"
              data-aos-delay={data.aosDelay}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-600/10 dark:from-primary/20 dark:to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="p-6">
                <div className="h-40 mb-6 relative">
                  <img
                    src={data.image}
                    alt={data.category}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {data.category}
                  </h2>
                  <div className="w-16 h-1 bg-primary rounded-full transform origin-left group-hover:scale-x-150 transition-transform duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a
            href="http://localhost:5174/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-primary rounded-full shadow-lg hover:scale-105 transition-all">
              🚗 Explore 3D Vehicle Gallery
            </button>
          </a>
        </div>
        
      </div>
    </div>
  );
};

export default CarList;
