import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import { FaUser } from "react-icons/fa";

const ViewVehicle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("adminTheme") || "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("auth_token");
    if (tokenFromLocalStorage == null) {navigate('/signin')}
  },[])

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/vehicles");
        if (response.ok) {
          const data = await response.json();
          setVehicles(data);
        } else {
          alert("Failed to fetch vehicles");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching vehicles");
      }
    };
    fetchVehicles();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("adminTheme", newTheme);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("role");
    navigate("/signin");
  };
  const handleFilterChange = (event) => setSelectedFilter(event.target.value);

  // Updated function for navigating to AdminProfile
  const handleAdminProfileClick = () => navigate("/AdminProfile");

  const filteredVehicles = selectedFilter === "All"
    ? vehicles
    : vehicles.filter((vehicle) => vehicle.make === selectedFilter);

  const handleAdminBack = () => navigate("/admin-dashboard");

  if (vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <nav className={`sticky top-0 z-50 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-3xl font-extrabold">
              <span className="text-blue-500">Admin</span>
              <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Dashboard</span>
            </h1>

            <div className="hidden md:flex items-center space-x-4">
              <button onClick={() => navigate("/admin-dashboard")} className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>
                Home
              </button>

              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>
                  Manage Vehicle
                  <span className={`transform transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}>▼</span>
                </button>

                {dropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"} ring-1 ring-black ring-opacity-5`}>
                    <div className="py-1">
                      <button onClick={() => navigate("/Admin/AddVehicle")} className={`block w-full text-left px-4 py-2 text-sm ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>Add Vehicle</button>
                      <button onClick={() => navigate("/Admin/ViewVehicle")} className={`block w-full text-left px-4 py-2 text-sm ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>View Vehicle</button>
                      <button onClick={() => navigate("/Admin/PendingVehicles")} className={`block w-full text-left px-4 py-2 text-sm ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>Pending Vehicle</button>

                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => navigate("/Admin/ManageUsers")} className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>
                Manage Users
              </button>

              <button onClick={() => navigate("/Admin/Appointments")} className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>
                Appointments
              </button>

              {theme === 'dark' ? (
                <BiSolidSun onClick={toggleTheme}
                  className="text-2xl cursor-pointer text-white hover:text-yellow-300 transition-all duration-300 transform hover:scale-110"
                />
              ) : (
                <BiSolidMoon onClick={toggleTheme}
                  className="text-2xl cursor-pointer text-gray-900 hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
                />
              )}

              <FaUser onClick={handleAdminProfileClick}
                className={`text-2xl cursor-pointer transition-all duration-300 transform hover:scale-110 ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-500'}`}
              />

              <button onClick={handleLogout} className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"} text-white`}>
                Logout
              </button>
            </div>

            <button onClick={toggleMenu} className="md:hidden p-2 rounded-lg hover:bg-gray-700">
              {menuOpen ? <HiMenuAlt1 className="text-2xl" /> : <HiMenuAlt3 className="text-2xl" />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className={`fixed inset-0 z-40 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className={`h-full w-64 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
            <div className="p-4 space-y-4">
              <button onClick={() => { navigate("/admin-dashboard"); toggleMenu(); }} className="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                Home
              </button>
              <button onClick={() => { navigate("/vehicle"); toggleMenu(); }} className="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                Manage Vehicle
              </button>
              <button onClick={() => { navigate("/Admin/ManageUsers"); toggleMenu(); }} className="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                Manage Users
              </button>
              <button onClick={() => { navigate("/Admin/Appointments"); toggleMenu(); }} className="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                Appointments
              </button>
              <button onClick={handleAdminProfileClick} className="w-full flex items-center py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                <FaUser className="mr-2" /> Profile
              </button>
              <button onClick={toggleTheme} className="w-full flex items-center py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                {theme === "dark" ? <BiSolidSun className="mr-2" /> : <BiSolidMoon className="mr-2" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
              <button onClick={handleLogout} className="w-full py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-300">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            View All Vehicles
          </h2>

          <div className="flex items-center space-x-4">
            <label htmlFor="filter" className="font-medium">Filter by Make:</label>
            <select
              id="filter"
              value={selectedFilter}
              onChange={handleFilterChange}
              className={`px-4 py-2 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-700 focus:border-blue-500" : "bg-white border-gray-300 focus:border-blue-500"} focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300`}
            >
              <option value="All">All</option>
              {[...new Set(vehicles.map((vehicle) => vehicle.make))].map((make) => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`rounded-xl overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
            >
              {vehicle.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`http://127.0.0.1:8000/storage/${vehicle.image}`}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{vehicle.make} {vehicle.model}</h3>
                <div className="space-y-2 mb-4">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Year</span>
                    <span className="font-medium">{vehicle.year}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Price</span>
                    <span className="font-medium">Rs.{vehicle.price.toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Mileage</span>
                    <span className="font-medium">{vehicle.mileage.toLocaleString()} miles</span>
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                  className={`w-full py-2 px-4 rounded-lg ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white font-medium transition-colors duration-300`}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ViewVehicle;
