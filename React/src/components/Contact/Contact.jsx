import React from "react";

const Contact = () => {
  return (
    <>
      <span id="contact"></span>
      <div data-aos="zoom-in" className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-gradient-to-br from-gray-800 to-gray-900 dark:bg-black dark:text-white rounded-xl shadow-2xl py-10 px-8">
            {/* Left side */}
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                Let's collaborate on finding the perfect vehicle for you.{" "}
                <span className="text-blue-400">Your dream car awaits!</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Reach out to us through the following:
              </p>
              <div className="space-y-4 bg-gray-700/50 dark:bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
                <p className="text-white flex items-center gap-3">
                  <span className="bg-blue-500 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </span>
                  <span><strong>Phone Hotline:</strong> 0789 25 4555</span>
                </p>
                <p className="text-white flex items-center gap-3">
                  <span className="bg-blue-500 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </span>
                  <span><strong>Email:</strong> driveline@gmail.com</span>
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="sm:flex sm:flex-col sm:justify-center">
              <div className="bg-gray-700/30 dark:bg-gray-800/30 p-8 rounded-xl backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full p-4 rounded-lg bg-gray-600 dark:bg-gray-700 text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-500 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full p-4 rounded-lg bg-gray-600 dark:bg-gray-700 text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-500 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <textarea
                      placeholder="Your Message"
                      className="w-full p-4 rounded-lg bg-gray-600 dark:bg-gray-700 text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-500 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                      rows="4"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transform hover:scale-[1.02] transition-all duration-200 focus:ring-4 focus:ring-blue-500/50"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
