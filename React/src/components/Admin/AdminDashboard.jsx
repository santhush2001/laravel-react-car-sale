import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import axios from "axios";

const AdminDashboard = () => {
  const [theme, setTheme] = useState(localStorage.getItem("adminTheme") || "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [vehicleCount, setVehicleCount] = useState(0);  // Default state as number (0)
  const [userCount, setUserCount] = useState(0);  // Default state as number (0)
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("auth_token");
    if (tokenFromLocalStorage == null) {navigate('/signin')}
  },[])

  const getVehicleCount = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/count1");
      setVehicleCount(response.data.count); // Assuming response contains a `count` field
    } catch (error) {
      console.error("Error fetching vehicle count:", error);
    }
  };

  const getUserCount = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/count2");
      setUserCount(response.data.count); // Assuming response contains a `count` field
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  useEffect(() => {
    getVehicleCount();
    getUserCount();
  }, []);


  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    localStorage.setItem("adminTheme", theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("role");
    navigate("/signin");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleAdminProfileClick = () => navigate("/Adminprofile");

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <nav className={`sticky top-0 z-50 ${theme === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-lg transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-3xl font-extrabold">
              <span className="text-blue-500">Admin</span>
              <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Dashboard</span>
            </h1>

            <div className="hidden md:flex items-center space-x-4">
              <button onClick={() => navigate("/admin-dashboard")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}>
                Home
              </button>

              <div className="relative">
                <button onClick={toggleDropdown}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}>
                  Manage Vehicle
                  <span className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}>▼</span>
                </button>

                {dropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-700" : "bg-white"
                    } ring-1 ring-black ring-opacity-5`}>
                    <div className="py-1">
                      <button onClick={() => navigate("/Admin/AddVehicle")}
                        className={`block w-full text-left px-4 py-2 text-sm ${theme === "dark"
                          ? "text-white hover:bg-gray-600"
                          : "text-gray-900 hover:bg-gray-100"
                          }`}>
                        Add Vehicle
                      </button>
                      <button onClick={() => navigate("/Admin/ViewVehicle")}
                        className={`block w-full text-left px-4 py-2 text-sm ${theme === "dark"
                          ? "text-white hover:bg-gray-600"
                          : "text-gray-900 hover:bg-gray-100"
                          }`}>
                        View Vehicle
                      </button>
                      <button onClick={() => navigate("/Admin/PendingVehicles")}
                        className={`block w-full text-left px-4 py-2 text-sm ${theme === "dark"
                          ? "text-white hover:bg-gray-600"
                          : "text-gray-900 hover:bg-gray-100"
                          }`}>
                        Pending Vehicles
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => navigate("/Admin/ManageUsers")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}>
                Manage Users
              </button>

              <button onClick={() => navigate("/Admin/Appointments")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}>
                Appointments
              </button>

              <div className="flex items-center space-x-4">
                <FaUser onClick={handleAdminProfileClick}
                  className={`text-2xl cursor-pointer transition-colors duration-300 ${theme === "dark" ? "text-white hover:text-gray-300" : "text-gray-900 hover:text-gray-600"
                    }`}
                />

                {theme === "dark" ? (
                  <BiSolidSun onClick={toggleTheme}
                    className="text-2xl cursor-pointer text-white hover:text-gray-300 transition-colors duration-300"
                  />
                ) : (
                  <BiSolidMoon onClick={toggleTheme}
                    className="text-2xl cursor-pointer text-gray-900 hover:text-gray-600 transition-colors duration-300"
                  />
                )}

                <button onClick={handleLogout}
                  className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-400 transition-all duration-300">
                  Logout
                </button>
              </div>
            </div>

            <div className="md:hidden">
              {menuOpen ? (
                <HiMenuAlt1 onClick={toggleMenu} className="text-3xl cursor-pointer" />
              ) : (
                <HiMenuAlt3 onClick={toggleMenu} className="text-3xl cursor-pointer" />
              )}
            </div>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className={`md:hidden p-4 space-y-3 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          {["Home", "Manage Vehicle", "Manage Users", "Appointments"].map((item) => (
            <button
              key={item}
              onClick={() => navigate(item === "Home" ? "/admin-dashboard" : `/Admin/${item.replace(" ", "")}`)}
              className={`block w-full text-left px-4 py-2 rounded-lg transition-colors duration-300
                ${theme === "dark"
                  ? "text-gray-200 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"}`}
            >
              {item}
            </button>
          ))}
          <div className="flex items-center justify-between px-4 py-2">
            {theme === "dark" ? (
              <BiSolidSun onClick={toggleTheme} className="text-2xl cursor-pointer text-yellow-400" />
            ) : (
              <BiSolidMoon onClick={toggleTheme} className="text-2xl cursor-pointer text-indigo-600" />
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        <section className="relative overflow-hidden rounded-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
          <div className="relative p-8">
            <h2 className="text-4xl font-extrabold text-white mb-2">Welcome to the Admin Dashboard</h2>
            <p className="text-lg text-white/90">Empowering you to manage and grow efficiently</p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[{ title: "Total Vehicles", count: vehicleCount, icon: "fas fa-car", color: "blue" },
          { title: "Total Users", count: userCount, icon: "fas fa-users", color: "green" }]
            .map((item) => (
              <div
                key={item.title}
                className={`p-6 rounded-xl transition-transform duration-300 transform hover:scale-105 ${theme === "dark"
                  ? "bg-gray-800/50 backdrop-blur-lg"
                  : "bg-white/70 backdrop-blur-md"}`}
              >
                <div className={`flex items-center ${item.color === "blue" ? "text-blue-500" : "text-green-500"}`}>
                  <i className={`${item.icon} text-3xl mr-4`}></i>
                  <div>
                    <p className="text-lg font-semibold">{item.title}</p>
                    <p className="text-2xl font-bold">{item.count}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold">Trending Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Vehicle Growth", progress: 75, color: "blue" },
              { title: "User Engagement", progress: 60, color: "green" }
            ].map((item) => (
              <div
                key={item.title}
                className={`p-6 rounded-xl transition-transform duration-300 transform hover:scale-105 ${theme === "dark"
                  ? "bg-gray-800/50 backdrop-blur-lg"
                  : "bg-white shadow-lg"
                  }`}
              >
                <h4 className="text-lg font-semibold mb-4">{item.title}</h4>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${item.color}-500 rounded-full transition-all duration-1000`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-2">{item.progress}% {item.title === "Vehicle Growth" ? "of vehicles listed this month" : "of users are actively using the platform"}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className={`p-6 text-center ${theme === 'dark' ? 'bg-gray-800/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'} mt-8`}>
        <p className="text-sm">&copy; {new Date().getFullYear()} DriveLine. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;