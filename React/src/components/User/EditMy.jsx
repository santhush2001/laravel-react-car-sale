import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"; // For back arrow
import { faPlus, faSearch, faUser, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
const EditMy = () => {
  const { id } = useParams(); // Get vehicle ID from URL
  const [vehicle, setVehicle] = useState(null);
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
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("userTheme") || "light");
  const navigate = useNavigate();
  
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("auth_token");
    if (tokenFromLocalStorage == null) {navigate('/signin')}
  },[])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("userTheme", newTheme);
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
            icon: "error",
            title: "Failed to Fetch Vehicle Details",
            text: "An error occurred while trying to retrieve vehicle details. Please try again.",
          });
        }

      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while fetching vehicle details. Please try again.",
        });
      } finally {
        setLoading(false);
      }

    };

    fetchVehicleDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedVehicle = {
      make: formData.make,
      model: formData.model,
      year: formData.year,
      price: formData.price,
      mileage: formData.mileage,
      condition: formData.condition,
      engine_type: formData.engine_type,
      transmission: formData.transmission,
      fuel_type: formData.fuel_type,
      seating_capacity: formData.seating_capacity,
      description: formData.description,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/vehicles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(updatedVehicle),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Vehicle updated successfully!",
        }).then(() => {
          navigate(`/modify-vehicle/${id}`); // Redirect after successful update
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Failed to update vehicle. Please try again.",
        });
      }

    } catch (error) {
      console.error("Error updating vehicle:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "An error occurred while updating vehicle details. Please try again.",
      });
    }

  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    navigate('/signin');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!vehicle) {
    return <div>Vehicle not found</div>;
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
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faHome} className="text-xl text-blue-500" />
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faUser} className="text-xl text-blue-500" />
              </button>
              <button
                onClick={() => navigate("/ViewSchedule")}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faCalendar} className="text-xl text-purple-500" />
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
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300"
              >
                Logout
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Vehicle</h1>

        <div className="border p-6 rounded-lg shadow-lg mt-4 bg-white dark:bg-gray-800 transition duration-300">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-900 dark:text-gray-300">Make</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                />

              </div>
              <div>
                <label className="block text-gray-900">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-900 dark:text-gray-300">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-900 dark:text-gray-300">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-900 dark:text-gray-300">Mileage</label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-900 dark:text-gray-300">Condition</label>
                <input
                  type="text"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-900 dark:text-gray-300">Engine Type</label>
                <input
                  type="text"
                  name="engine_type"
                  value={formData.engine_type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-900 dark:text-gray-300">Transmission</label>
                <input
                  type="text"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-900 dark:text-gray-300">Fuel Type</label>
                <input
                  type="text"
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-900 dark:text-gray-300">Seating Capacity</label>
                <input
                  type="number"
                  name="seating_capacity"
                  value={formData.seating_capacity}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-900 dark:text-gray-300">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex gap-4 justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
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

export default EditMy;
