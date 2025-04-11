import React from "react";
import { FaCameraRetro } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { SlNote } from "react-icons/sl";

const servicesData = [
  {
    name: "Best Deals",
    icon: <FaCameraRetro className="text-5xl text-primary group-hover:text-white duration-300" />,
    description: "Get the best deals on quality second-hand vehicles.",
    aosDelay: "0",
  },
  {
    name: "Fast and Reliable",
    icon: <GiNotebook className="text-5xl text-primary group-hover:text-white duration-300" />,
    description: "Quick and trustworthy service you can count on.",
    aosDelay: "500",
  },
  {
    name: "Expert Guidance",
    icon: <SlNote className="text-5xl text-primary group-hover:text-white duration-500" />,
    description: "Professional advice to help you make informed decisions.",
    aosDelay: "1000",
  },
];

const Services = () => {
  return (
    <div id="services" className="dark:bg-black dark:text-white py-20 min-h-screen relative overflow-hidden bg-gray-50 text-gray-800">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="pb-16 text-center space-y-4">
          <div className="flex justify-center items-center gap-2" data-aos="fade-up">
            <span className="w-8 h-1 bg-primary rounded"></span>
            <p className="text-5xl lg:text-7xl font-semibold font-serif mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text" >Our Services</p>
            <span className="w-8 h-1 bg-primary rounded"></span>
          </div>
          <h1 
            data-aos="fade-up" 
            className="text-4xl sm:text-5xl font-bold font-serif"
          >
            Why Choose <span className="text-primary">Us</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <div
              key={service.name}
              data-aos="fade-up"
              data-aos-delay={service.aosDelay}
              className="group relative"
            >
              {/* Card Background with Gradient Border */}
              <div className="absolute inset-0.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              
              {/* Card Content */}
              <div className="relative h-full bg-white dark:bg-dark hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 duration-300 rounded-xl p-8 flex flex-col items-center gap-6 shadow-lg dark:shadow-lg group-hover:shadow-2xl group-hover:scale-[1.02] transition-all">
                {/* Icon Container */}
                <div className="w-16 h-16 grid place-items-center bg-gray-100 dark:bg-dark/20 rounded-xl group-hover:bg-white/10 transition-colors">
                  {service.icon}
                </div>

                {/* Text Content */}
                <div className="text-center space-y-4">
                  <h1 className="text-2xl font-bold group-hover:text-white transition-colors">
                    {service.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 group-hover:text-white/90 transition-colors leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Hover Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-500/30 rounded group-hover:bg-white/30 transition-colors"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
