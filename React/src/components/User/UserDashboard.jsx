import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendar, faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
const UserDashboard = () => {
  const [theme, setTheme] = useState(localStorage.getItem("userTheme") || "light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [selectedModel, setSelectedModel] = useState("All");
  const [fuelType, setFuelType] = useState("All");
  const [transmission, setTransmission] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [mileageRange, setMileageRange] = useState({ min: 0, max: Infinity });
  const [condition, setCondition] = useState("All");
  const [comparisonList, setComparisonList] = useState([]);
  const [user, setUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
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
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUserData();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("userTheme", newTheme);
  };
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchMake = selectedFilter === "All" || vehicle.make === selectedFilter;
    const matchYear = filterYear === "All" || vehicle.year.toString() === filterYear;
    const matchModel = selectedModel === "All" || vehicle.model === selectedModel;
    const matchFuelType = fuelType === "All" || vehicle.fuel_type === fuelType;
    const matchTransmission = transmission === "All" || vehicle.transmission === transmission;
    const matchPrice = vehicle.price >= priceRange.min && vehicle.price <= priceRange.max;
    const matchMileage = vehicle.mileage >= mileageRange.min && vehicle.mileage <= mileageRange.max;
    const matchCondition = condition === "All" || vehicle.condition === condition;
    return (
      matchMake &&
      matchYear &&
      matchModel &&
      matchFuelType &&
      matchTransmission &&
      matchPrice &&
      matchMileage &&
      matchCondition
    );
  });
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
        {/* Filter Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"
              } shadow-md transition-colors`}
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
          </button>
        </div>
        {/* Filters */}
        {showFilters && (
          <div className={`mb-8 p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Make Filter */}
              <div className="space-y-2">
                <label className="block font-medium">Make</label>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className={`w-full p-2 rounded-md border ${theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                    }`}
                >
                  <option value="All">All Makes</option>
                  {[...new Set(vehicles.map((v) => v.make))].map((make) => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              {/* Model Filter */}
              <div className="space-y-2">
                <label className="block font-medium">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className={`w-full p-2 rounded-md border ${theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                    }`}
                >
                  <option value="All">All Models</option>
                  {[...new Set(vehicles.map((v) => v.model))].map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* Fuel Type Filter */}
              <div className="space-y-2">
                <label className="block font-medium">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className={`w-full p-2 rounded-md border ${theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                    }`}
                >
                  <option value="All">All Fuel Types</option>
                  {[...new Set(vehicles.map((v) => v.fuel_type))].map((fuel) => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>
              {/* Transmission Filter */}
              <div className="space-y-2">
                <label className="block font-medium">Transmission</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className={`w-full p-2 rounded-md border ${theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                    }`}
                >
                  <option value="All">All Transmissions</option>
                  {[...new Set(vehicles.map((v) => v.transmission))].map((trans) => (
                    <option key={trans} value={trans}>{trans}</option>
                  ))}
                </select>
              </div>
              {/* Year Filter */}
              <div className="space-y-2">
                <label className="block font-medium">Year</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className={`w-full p-2 rounded-md border ${theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                    }`}
                >
                  <option value="All">All Years</option>
                  {[...new Set(vehicles.map((v) => v.year))].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              {/* Price Range */}
              <div className="space-y-2">
                <label className="block font-medium">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className={`w-full p-2 rounded-md border ${theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                      }`}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className={`w-full p-2 rounded-md border ${theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                      }`}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  />
                </div>
              </div>
              {/* Mileage Range */}
              <div className="space-y-2">
                <label className="block font-medium">Mileage Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className={`w-full p-2 rounded-md border ${theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                      }`}
                    onChange={(e) => setMileageRange({ ...mileageRange, min: Number(e.target.value) })}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className={`w-full p-2 rounded-md border ${theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                      }`}
                    onChange={(e) => setMileageRange({ ...mileageRange, max: Number(e.target.value) })}
                  />
                </div>
              </div>
              {/* Condition Filter */}
              <div className="space-y-2">
                <label className="block font-medium">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className={`w-full p-2 rounded-md border ${theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                    }`}
                >
                  <option value="All">All Conditions</option>
                  {[...new Set(vehicles.map((v) => v.condition))].map((cond) => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform ${theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
            >
              {vehicle.image && (
                <div className="relative h-48">
                  <img
                    src={`http://127.0.0.1:8000/storage/${vehicle.image}`}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {vehicle.make} {vehicle.model}
                </h3>

                <div className="space-y-2 mb-4">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Year:</span>
                    <span className="font-medium">{vehicle.year}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-medium">Rs.{vehicle.price.toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Mileage:</span>
                    <span className="font-medium">{vehicle.mileage.toLocaleString()} miles</span>
                  </p>
                </div>
                <div className="flex justify-between gap-4">
                  <button
                    onClick={() => navigate(`/buy/${vehicle.id}`)}
                    className="flex-1 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => {
                      if (!comparisonList.some(v => v.id === vehicle.id)) {
                        setComparisonList([...comparisonList, vehicle]);
                      }
                    }}
                    className="flex-1 px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
                  >
                    Compare
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Compare Button */}
        {comparisonList.length > 0 && (
          <div className="fixed bottom-8 left-8">
            <button
              onClick={() => {
                if (comparisonList.length >= 2) {
                  navigate("/comparison", { state: { comparisonList } });
                } else {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Not enough vehicles',
                    text: 'Please select at least two vehicles to compare.',
                    confirmButtonText: 'Ok'
                  });
                }
              }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
            >
              Compare ({comparisonList.length}) Vehicles
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
export default UserDashboard;
