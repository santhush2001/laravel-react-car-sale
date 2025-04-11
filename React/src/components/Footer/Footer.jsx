import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLocationArrow,
  FaMobileAlt,
  FaWhatsapp,
} from "react-icons/fa";

const FooterLinks = [
  {
    title: "Home",
    link: "#",
  },
  {
    title: "About",
    link: "#about",
  },
  {
    title: "Contact",
    link: "#contact",
  },
];

const Footer = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 mt-14 rounded-t-3xl shadow-inner">
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 py-8 gap-8">
          {/* Company Details */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-3 font-serif text-gray-800 dark:text-white">
              DriveLine
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Have questions or need assistance? Contact Driveline today! We're here to help with all your second-hand vehicle needs.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                <FaLocationArrow className="text-primary" />
                <p>Kandy, Sri Lanka</p>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                <FaMobileAlt className="text-primary" />
                <p>+94 710852093</p>
              </div>
            </div>
            {/* Social Handles */}
            <div className="flex items-center gap-6 mt-8">
              <a
                href="https://www.instagram.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transform hover:scale-110 transition-all"
              >
                <FaInstagram className="text-3xl" />
              </a>
              <a
                href="https://www.facebook.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transform hover:scale-110 transition-all"
              >
                <FaFacebook className="text-3xl" />
              </a>
              <a
                href="https://www.whatsapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-green-500 transform hover:scale-110 transition-all"
              >
                <FaWhatsapp className="text-3xl" />
              </a>
            </div>
          </div>

          {/* Links and Map */}
          <div className="grid grid-cols-1 md:grid-cols-2 col-span-2 gap-8">
            {/* Important Links */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Important Links
              </h1>
              <ul className="space-y-4">
                {FooterLinks.map((link) => (
                  <li
                    key={link.title}
                    className="group cursor-pointer"
                  >
                    <a 
                      href={link.link}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors group-hover:translate-x-2 duration-300"
                    >
                      <span className="text-primary">&#11162;</span>
                      <span>{link.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map Section */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Find Us Here
              </h1>
              <div className="w-full h-64 rounded-lg overflow-hidden shadow-md">
                <iframe
                  title="Sri Lanka Vehicle Sale Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31707.47972158909!2d80.63372600590314!3d7.292843457215559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae366c0db9f3b5d%3A0x3f87c6fc93308d56!2sKandy%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;