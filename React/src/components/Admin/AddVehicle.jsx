import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import { FaUser } from "react-icons/fa";

const AddVehicle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("adminTheme") || "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("auth_token");
    if (tokenFromLocalStorage == null) {navigate('/signin')}
  },[])

  const [formData, setFormData] = useState({
    make: "", model: "", year: "", price: "", mileage: "",
    condition: "", engine_type: "", transmission: "",
    fuel_type: "", seating_capacity: "", description: "", image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    try {
      // Adding logs to check the form data and response
      console.log("Sending form data:", formData); // Log the data being sent

      const response = await fetch("http://127.0.0.1:8000/api/vehicles", {
        method: "POST",
        body: form,
      });

      // Checking the response from the server
      if (response.ok) {
        console.log("Vehicle added successfully:", response); // Log success response
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Vehicle added successfully",
        }).then(() => {
          navigate("/Admin/ViewVehicle");
        });
      } else {
        const errorText = await response.text();
        console.error("Failed to add vehicle:", errorText); // Log error response from the server
        Swal.fire({
          icon: "error",
          title: "Add Vehicle Failed",
          text: `Failed to add vehicle: ${errorText}`,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while adding the vehicle",
      });
    }

  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "dark" ? "light" : "dark"));
    localStorage.setItem("adminTheme", theme === "dark" ? "light" : "dark");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("role");
    navigate("/signin");
  };
  const handleAdminProfileClick = () => navigate("/Adminprofile");

  const inputClass = `w-full p-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${theme === "dark"
    ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
    : "bg-white border-gray-300 text-gray-900 focus:border-blue-400 focus:ring-blue-400"
    }`;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}>
      {/* Navigation */}
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={`md:hidden transition-all duration-300 ${theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-lg`}>
          <div className="px-4 py-3 space-y-3">
            <button onClick={() => navigate("/admin-dashboard")}
              className="block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors duration-300">
              Home
            </button>
            <button onClick={() => navigate("/vehicle")}
              className="block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors duration-300">
              Manage Vehicle
            </button>
            <button onClick={() => navigate("/Admin/ManageUsers")}
              className="block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors duration-300">
              Manage Users
            </button>
            <button onClick={() => navigate("/Admin/Appointments")}
              className="block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors duration-300">
              Appointments
            </button>
            <div onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer">
              {theme === "dark" ? (
                <BiSolidSun className="text-2xl" />
              ) : (
                <BiSolidMoon className="text-2xl" />
              )}
              <span>Toggle Theme</span>
            </div>
            <button onClick={handleLogout}
              className="block w-full px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-400 transition-all duration-300">
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-xl shadow-lg p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}>
          <h2 className="text-3xl font-bold mb-8">Add a New Vehicle</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="make"
                placeholder="Make"
                value={formData.make}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                type="text"
                name="model"
                placeholder="Model"
                value={formData.model}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                type="number"
                name="year"
                placeholder="Year"
                value={formData.year}
                onChange={handleChange}
                className={inputClass} min="1"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className={inputClass} min="0" step="0.01"
              />
              <input
                type="number"
                name="mileage"
                placeholder="Mileage"
                value={formData.mileage}
                onChange={handleChange}
                className={inputClass} min="0"
              />
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
              <input
                type="text"
                name="engine_type"
                placeholder="Engine Type"
                value={formData.engine_type}
                onChange={handleChange}
                className={inputClass}
              />
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Transmission</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
              <select
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <input
                type="number"
                name="seating_capacity"
                placeholder="Seating Capacity"
                value={formData.seating_capacity}
                onChange={handleChange}
                className={inputClass} min="0"
              />
            </div>

            <textarea
              name="description"
              placeholder="Vehicle Description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`${inputClass} w-full resize-none`}
            />

            <div className={`p-4 rounded-lg border-2 border-dashed ${theme === "dark" ? "border-gray-700" : "border-gray-300"
              }`}>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${theme === "dark"
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-blue-500 hover:bg-blue-400"
                }`}
            >
              Add Vehicle
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddVehicle;