import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faUser, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { BiSolidMoon, BiSolidSun } from "react-icons/bi";
import { faHome } from "@fortawesome/free-solid-svg-icons";


const UserAddVehicle = () => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    condition: "",
    engine_type: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: "",
    description: "",
    image: null,
  });

  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("auth_token");
    if (tokenFromLocalStorage == null) {navigate('/signin')}
  },[])

  useEffect(() => {
    const savedTheme = localStorage.getItem("userTheme") || "light";
    setTheme(savedTheme);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("userTheme", newTheme);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/pending-vehicles", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: form,
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Submitted!',
          text: 'Vehicle submitted for approval!',
          confirmButtonText: 'Ok'
        }).then(() => {
          navigate("/user-dashboard"); // Redirect after successful submission
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to submit vehicle. Please try again.',
          confirmButtonText: 'Try Again'
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while submitting the vehicle.',
        confirmButtonText: 'Ok'
      });
    }

  };

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
    >
      {/* Navbar */}
      <header className={`sticky top-0 z-50 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                DriveLine
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/user-dashboard")}
                className="p-2 rounded-full hover:bg-gray-200 text-blue-500 font-bold transition-colors"
              >
                <FontAwesomeIcon icon={faHome} className="text-xl" />
                <span className="ml-2">Dashboard</span>
              </button>
              <button
                onClick={() => navigate("/UserAddVehicle")}
                className="p-2 rounded-full hover:bg-gray-200 text-blue-500 font-bold transition-colors"

              >
                <FontAwesomeIcon icon={faPlus} className="text-xl" />
                <span className="ml-2">Add Vehicle</span>
              </button>

              <button
                onClick={() => navigate("/my-vehicles")}
                className="p-2 rounded-full hover:bg-gray-200 text-blue-500 font-bold transition-colors"
              >
                <FontAwesomeIcon icon={faSearch} className="text-xl" />
                <span className="ml-2">My Vehicles</span>
              </button>



              <button
                onClick={() => navigate("/profile")}
                className="p-2 rounded-full hover:bg-gray-200 text-blue-500 font-bold transition-colors"
              >
                <FontAwesomeIcon icon={faUser} className="text-xl" />
              </button>

              <button
                onClick={() => navigate("/ViewSchedule")}
                className="p-2 rounded-full hover:bg-gray-200 text-purple-500 transition-colors"
              >
                <FontAwesomeIcon icon={faCalendar} className="text-xl" />
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              >
                {theme === "dark" ? (
                  <BiSolidSun className="text-xl text-yellow-400" />
                ) : (
                  <BiSolidMoon className="text-xl text-gray-600" />
                )}
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("auth_token");
                  localStorage.removeItem("role");
                  navigate("/signin");
                }}
                className="ml-4 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Submit a New Vehicle for Approval</h1>
        <form
          onSubmit={handleSubmit}
          className={`space-y-6 p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="make"
              placeholder="Make"
              value={formData.make}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-transparent"
              required
            />
            <input
              type="text"
              name="model"
              placeholder="Model"
              value={formData.model}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-transparent"
              required
            />
            <input
              type="number"
              name="year"
              placeholder="Year"
              value={formData.year}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-transparent"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-transparent"
              required
            />
            <input
              type="number"
              name="mileage"
              placeholder="Mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-transparent"
              required
            />
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${theme === "dark"
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
                }`}
              required
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
              className="w-full p-3 rounded-lg border border-gray-300 bg-transparent"
              required
            />
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${theme === "dark"
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
                }`}
              required
            >
              <option value="">Select Transmission</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
            <select
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${theme === "dark"
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
                }`}
              required
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
              className="w-full p-3 rounded-lg border border-gray-300 bg-transparent"
              required
            />
          </div>

          <textarea
            name="description"
            placeholder="Vehicle Description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 rounded-lg border border-gray-300 bg-transparent"
          />

          <div className="p-4 rounded-lg border-2 border-dashed border-gray-300">
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full bg-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
          >
            Submit for Approval
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAddVehicle;
