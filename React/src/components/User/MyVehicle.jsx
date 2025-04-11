import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faPlus, faSearch, faUser, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";


const MyVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("userTheme") || "light");
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("auth_token");
    if (tokenFromLocalStorage == null) {navigate('/signin')}
  },[])

  useEffect(() => {
    // Fetch only the logged-in user's vehicles
    fetch("http://127.0.0.1:8000/api/my-vehicles", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`, // Send the auth token
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data); // Update the state with the fetched vehicles
        setLoading(false); // Turn off the loading spinner
      })
      .catch((error) => {
        console.error("Error fetching my vehicles:", error);
        setLoading(false); // Handle error and turn off loading spinner
      });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("userTheme", newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">My Vehicles</h1>

        {vehicles.length === 0 ? (
          <p className="text-gray-600">You have no vehicles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                  }`}
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


                  {/* Modify Button */}
                  <button
                    onClick={() => navigate(`/modify-vehicle/${vehicle.id}`)} // Navigate to the modify page
                    className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300"
                  >
                    Modify
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyVehicle;
