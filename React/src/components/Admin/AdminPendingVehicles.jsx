import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { FaUser } from "react-icons/fa";

const AdminPendingVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("adminTheme") || "dark");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("auth_token");
    if (tokenFromLocalStorage == null) {navigate('/signin')}
  },[])

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/pending-vehicles", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching pending vehicles:", error);
        setLoading(false);
      });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("adminTheme", newTheme);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleApprove = (id) => {
    fetch(`http://127.0.0.1:8000/api/pending-vehicles/${id}/approve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
    })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Vehicle Approved!",
          text: "The vehicle has been successfully approved.",
          confirmButtonText: "Ok",
        });
        setVehicles(vehicles.filter((v) => v.id !== id));
      })
      .catch((error) => {
        console.error("Error approving vehicle:", error);
      });
  };

  const handleReject = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reject this vehicle?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://127.0.0.1:8000/api/pending-vehicles/${id}/reject`, {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
        })
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Vehicle Rejected!",
              text: "The vehicle has been successfully rejected.",
              confirmButtonText: "Ok",
            });
            setVehicles(vehicles.filter((v) => v.id !== id));
          })
          .catch((error) => {
            console.error("Error rejecting vehicle:", error);
          });
      }
    });
  };
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("role");
    navigate("/signin");
  };

  const handleAdminProfileClick = () => {
    navigate("/admin-profile");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
    >
      <nav
        className={`sticky top-0 z-50 ${theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-lg transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin-dashboard")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
              >
                Home
              </button>

              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}
                >
                  Manage Vehicle
                  <span
                    className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""
                      }`}
                  >
                    ▼
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-700" : "bg-white"
                      } ring-1 ring-black ring-opacity-5`}
                  >
                    <div className="py-1">
                      <button
                        onClick={() => navigate("/Admin/AddVehicle")}
                        className={`block w-full text-left px-4 py-2 text-sm ${theme === "dark"
                          ? "text-white hover:bg-gray-600"
                          : "text-gray-900 hover:bg-gray-100"
                          }`}
                      >
                        Add Vehicle
                      </button>
                      <button
                        onClick={() => navigate("/Admin/ViewVehicle")}
                        className={`block w-full text-left px-4 py-2 text-sm ${theme === "dark"
                          ? "text-white hover:bg-gray-600"
                          : "text-gray-900 hover:bg-gray-100"
                          }`}
                      >
                        View Vehicle
                      </button>
                      <button
                        onClick={() => navigate("/Admin/PendingVehicles")}
                        className={`block w-full text-left px-4 py-2 text-sm ${theme === "dark"
                          ? "text-white hover:bg-gray-600"
                          : "text-gray-900 hover:bg-gray-100"
                          }`}
                      >
                        Pending Vehicles
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate("/Admin/ManageUsers")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
              >
                Manage Users
              </button>

              <button
                onClick={() => navigate("/Admin/Appointments")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
              >
                Appointments
              </button>

              <div className="flex items-center space-x-4">
                <FaUser
                  onClick={handleAdminProfileClick}
                  className={`text-2xl cursor-pointer transition-colors duration-300 ${theme === "dark"
                    ? "text-white hover:text-gray-300"
                    : "text-gray-900 hover:text-gray-600"
                    }`}
                />

                {theme === "dark" ? (
                  <BiSolidSun
                    onClick={toggleTheme}
                    className="text-2xl cursor-pointer text-white hover:text-gray-300 transition-colors duration-300"
                  />
                ) : (
                  <BiSolidMoon
                    onClick={toggleTheme}
                    className="text-2xl cursor-pointer text-gray-900 hover:text-gray-600 transition-colors duration-300"
                  />
                )}

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-400 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Pending Vehicles</h1>
        {vehicles.length === 0 ? (
          <p className="text-gray-600">No pending vehicles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`rounded-xl overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"
                  } shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
              >
                {vehicle.image && (
                  <img
                    src={`http://127.0.0.1:8000/storage/${vehicle.image}`}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <p>Year: {vehicle.year}</p>
                  <p>Price: Rs.{vehicle.price.toLocaleString()}</p>
                  <p>Mileage: {vehicle.mileage.toLocaleString()} miles</p>
                  <p>Condition: {vehicle.condition}</p>
                  <p>Engine Type: {vehicle.engine_type}</p>
                  <p>Transmission: {vehicle.transmission}</p>
                  <p>Fuel Type: {vehicle.fuel_type}</p>
                  <p>Seating Capacity: {vehicle.seating_capacity}</p>
                  <p>Status: {vehicle.status}</p>
                  <p>Description: {vehicle.description}</p>
                  <p>Submitted By: {vehicle.user.email}</p>
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() => handleApprove(vehicle.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(vehicle.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPendingVehicles;
