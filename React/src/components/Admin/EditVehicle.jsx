import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";

const EditVehicle = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("adminTheme") || "dark");
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
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("auth_token");
    if (tokenFromLocalStorage == null) {navigate('/signin')}
  },[])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    localStorage.setItem("adminTheme", theme === "dark" ? "light" : "dark");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    // Clear tokens or any user session data
    localStorage.removeItem("auth_token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");

    // Display a success message using SweetAlert2
    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'You have been logged out successfully.',
    }).then(() => {
      // Redirect to login page after the alert is closed
      navigate("/signin");
    });
  };


  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/vehicles/${id}`);
        if (response.ok) {
          const data = await response.json();
          setVehicle(data);
          setFormData({
            make: data.make,
            model: data.model,
            year: data.year,
            price: data.price,
            mileage: data.mileage,
            condition: data.condition,
            engine_type: data.engine_type,
            transmission: data.transmission,
            fuel_type: data.fuel_type,
            seating_capacity: data.seating_capacity,
            description: data.description || "",
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed to Fetch Vehicle Details',
            text: 'There was an error while fetching vehicle details. Please try again later.',
          });
        }

      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: 'error',
          title: 'An error occurred',
          text: 'There was an issue fetching vehicle details. Please try again later.',
        });
      } finally {
        setLoading(false);
      }

    };

    fetchVehicleDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/vehicles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Vehicle details updated successfully!',
        });
        navigate(`/Vehicle/${id}`);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Failed to update vehicle details. Please try again.',
        });
      }

    } catch (error) {
      console.error("Error updating vehicle:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while updating the vehicle. Please try again later.',
      });
    }

  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!vehicle) {
    return <div className="text-center p-4">Vehicle not found</div>;
  }

  return (
    <div className={`dashboard-layout ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen`}>
      <nav className={`flex items-center justify-between p-4 ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"} shadow-lg`}>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          Admin <span className="text-secondary">Dashboard</span>
        </h1>
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className={`py-2 px-4 text-lg rounded-full transition-all duration-300 ${theme === "dark"
              ? "text-white bg-blue-600 hover:bg-blue-500"
              : "text-black bg-blue-400 hover:bg-blue-300"
              }`}
          >
            Home
          </button>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className={`py-2 px-6 text-lg rounded-full transition-all duration-300 ${theme === "dark"
                ? "text-white bg-blue-600 hover:bg-blue-500"
                : "text-black bg-blue-400 hover:bg-blue-300"
                } flex items-center gap-2`}
            >
              <span>Manage Vehicle</span>
              <span className={`text-lg ${dropdownOpen ? "rotate-180" : "rotate-0"} transition-all`}>▼</span>
            </button>
            {dropdownOpen && (
              <div className="absolute top-8 right-0 bg-white border border-gray-300 rounded shadow-md z-10">
                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={() => navigate("/Admin/AddVehicle")}
                    className={`py-2 px-4 text-gray-700 hover:bg-gray-200 ${theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-400 text-black"} rounded-md`}
                  >
                    Add Vehicle
                  </button>
                  <button
                    onClick={() => navigate("/Admin/ViewVehicle")}
                    className={`py-2 px-4 text-gray-700 hover:bg-gray-200 ${theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-400 text-black"} rounded-md`}
                  >
                    View Vehicle
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate("/Admin/ManageUsers")}
            className={`py-2 px-4 text-lg rounded-full transition-all duration-300 ${theme === "dark"
              ? "text-white bg-blue-600 hover:bg-blue-500"
              : "text-black bg-blue-400 hover:bg-blue-300"
              }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => navigate("/Admin/Appointments")}
            className={`py-2 px-4 text-lg rounded-full transition-all duration-300 ${theme === "dark"
              ? "text-white bg-blue-600 hover:bg-blue-500"
              : "text-black bg-blue-400 hover:bg-blue-300"
              }`}
          >
            Appointments
          </button>
          {theme === "dark" ? (
            <BiSolidSun
              onClick={toggleTheme}
              className="text-2xl cursor-pointer transition-all duration-300 hover:text-gray-300"
              title="Switch to Light Mode"
            />
          ) : (
            <BiSolidMoon
              onClick={toggleTheme}
              className="text-2xl cursor-pointer transition-all duration-300 hover:text-gray-300"
              title="Switch to Dark Mode"
            />
          )}
          <button
            onClick={handleLogout}
            className={`px-4 py-2 rounded-full text-white ${theme === "dark" ? "bg-red-600 hover:bg-red-500" : "bg-red-400 hover:bg-red-300"
              }`}
          >
            Logout
          </button>
        </div>
        <div className="md:hidden">
          {menuOpen ? (
            <HiMenuAlt1 onClick={toggleMenu} className="text-3xl cursor-pointer" />
          ) : (
            <HiMenuAlt3 onClick={toggleMenu} className="text-3xl cursor-pointer" />
          )}
        </div>
      </nav>

      <main className="p-6">
        <div className={`border p-6 rounded-lg shadow-lg mt-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <h2 className={`text-3xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Edit {vehicle.make} {vehicle.model}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Make</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"} shadow-md`}
                  required
                />
              </div>

              <div>
                <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"} shadow-md`}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"} shadow-md`}
                  required
                />
              </div>

              <div>
                <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"} shadow-md`}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Mileage</label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"} shadow-md`}
                />
              </div>

              <div>
                <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"} shadow-md`}
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Engine Type</label>
                <input
                  type="text"
                  name="engine_type"
                  value={formData.engine_type}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"} shadow-md`}
                />
              </div>

              <div>
                <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Transmission</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"} shadow-md`}
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>

            <div>
              <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Fuel Type</label>
              <select
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"} shadow-md`}
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Seating Capacity</label>
              <input
                type="number"
                name="seating_capacity"
                value={formData.seating_capacity}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"} shadow-md`}
              />
            </div>

            <div>
              <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full p-3 border rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"} shadow-md`}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className={`py-2 px-6 rounded-full text-lg font-semibold transition-all duration-300 ${theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-blue-400 text-black hover:bg-blue-300"}`}
              >
                Update Vehicle
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditVehicle;
