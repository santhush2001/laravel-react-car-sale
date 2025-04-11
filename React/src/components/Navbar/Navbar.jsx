import React, { useState } from "react";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import ResponsiveMenu from "./ResponsiveMenu";

export const Navlinks = [
  {
    id: 1,
    name: "HOME",
    link: "/#",
  },
  {
    id: 2,
    name: "ABOUT",
    link: "/#about",
  },
  {
    id: 3,
    name: "SERVICES",
    link: "/#services",
  },
  {
    id: 3,
    name: "CATEGORY",
    link: "/#carlist",
  },
  {
    id: 4,
    name: "CONTACT",
    link: "/#contact",
  },
  {
    id: 5,
    name: "SIGN IN",
    link: "/signin",
  },
  {
    id: 6,
    name: "SIGN UP",
    link: "/signup",
  },
];

const Navbar = ({ theme, setTheme }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-lg dark:shadow-gray-800/30 dark:text-white transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-12 md:h-16">
          {/* Logo */}
          <div className="relative">
            <span className="text-2xl md:text-3xl font-bold font-serif bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer">
              DriveLine
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6">
              {Navlinks.map(({ id, name, link }) => (
                <li key={id}>
                  <a
                    href={link}
                    className="relative text-base font-medium group py-1"
                  >
                    <span className="relative z-10 text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors duration-300 tracking-wide">
                      {name}
                    </span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
              ))}
              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
              >
                {theme === "dark" ? (
                  <BiSolidSun className="text-2xl text-yellow-500 hover:rotate-90 transition-transform duration-500" />
                ) : (
                  <BiSolidMoon className="text-2xl text-gray-600 hover:rotate-90 transition-transform duration-500" />
                )}
              </button>
            </ul>
          </nav>

          {/* Mobile Navigation Controls */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              {theme === "dark" ? (
                <BiSolidSun className="text-2xl text-yellow-500" />
              ) : (
                <BiSolidMoon className="text-2xl text-gray-600" />
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              {showMenu ? (
                <HiMenuAlt1 className="text-2xl text-primary" />
              ) : (
                <HiMenuAlt3 className="text-2xl text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <ResponsiveMenu showMenu={showMenu} />
    </div>
  );
};

export default Navbar;
