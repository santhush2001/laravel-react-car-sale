import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi"; // Icons for theme toggle
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"; // For back arrow
import { faPlus, faSearch, faUser, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const Modify = () => {
  const { id } = useParams(); // Get vehicle ID from URL
  const [vehicle, setVehicle] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("userTheme") || "light"); // User theme
  const [viewMedia, setViewMedia] = useState(false); // State to control media visibility
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
        } else {
          alert("Failed to fetch vehicle details");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching vehicle details");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  const handleMediaChange = (e) => {
    setMedia([...media, ...e.target.files]);
  };

  const handleMediaUpload = async () => {
    const formData = new FormData();
    media.forEach((file) => {
      formData.append("media[]", file);
    });

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/vehicles/${id}/media`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: formData,
      });
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Media uploaded successfully!',
          confirmButtonText: 'Ok'
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to upload media',
          confirmButtonText: 'Try Again'
        });
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while uploading media',
        confirmButtonText: 'Ok'
      });
    }

  };

  const toggleMediaVisibility = () => {
    setViewMedia(!viewMedia);
  };

  const handleDelete = async () => {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (confirmDelete.isConfirmed) {
      try {
        // First, delete from the 'vehicles' table
        const responseVehicles = await fetch(`http://127.0.0.1:8000/api/vehicles/${id}`, {
          method: "DELETE",
        });

        if (responseVehicles.ok) {
          // Then, delete from the 'pending-vehicles' table
          const responsePendingVehicles = await fetch(`http://127.0.0.1:8000/api/pending-vehicles/${id}/destroy`, {
            method: "POST",
          });

          if (responsePendingVehicles.ok) {
            await Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Vehicle deleted successfully.',
              confirmButtonText: 'Ok'
            });
            navigate("/user-dashboard"); // Redirect after deletion
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete vehicle from pending vehicles.',
              confirmButtonText: 'Try Again'
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to delete vehicle from the vehicles table.',
            confirmButtonText: 'Try Again'
          });
        }
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred while deleting the vehicle.',
          confirmButtonText: 'Ok'
        });
      }
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
        <h1 className="text-2xl font-bold mb-6">Modify Vehicle</h1>
        <div className="mt-6 flex gap-4 justify-end">
          {/* Edit Button */}
          <button
            onClick={() => navigate(`/edit-myvehicle/${vehicle.id}`)} // navigate to the edit page
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300"
          >
            Edit
          </button>
          {/* Delete Button */}
          <button
            onClick={handleDelete} // Trigger delete action
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
          >
            Delete
          </button>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <p className={`text-${theme === "dark" ? "gray-300" : "gray-900"} text-lg`}>
              <strong>Year:</strong> {vehicle.year}
            </p>
            <p className={`text-${theme === "dark" ? "gray-300" : "gray-900"} text-lg`}>
              <strong>Price:</strong> Rs: {vehicle.price}
            </p>
            <p className={`text-${theme === "dark" ? "gray-300" : "gray-900"} text-lg`}>
              <strong>Mileage:</strong> {vehicle.mileage} miles
            </p>
            <p className={`text-${theme === "dark" ? "gray-300" : "gray-900"} text-lg`}>
              <strong>Condition:</strong> {vehicle.condition}
            </p>
            <p className={`text-${theme === "dark" ? "gray-300" : "gray-900"} text-lg`}>
              <strong>Engine Type:</strong> {vehicle.engine_type}
            </p>
            <p className={`text-${theme === "dark" ? "gray-300" : "gray-900"} text-lg`}>
              <strong>Transmission:</strong> {vehicle.transmission}
            </p>
            <p className={`text-${theme === "dark" ? "gray-300" : "gray-900"} text-lg`}>
              <strong>Fuel Type:</strong> {vehicle.fuel_type}
            </p>
            <p className={`text-${theme === "dark" ? "gray-300" : "gray-900"} text-lg`}>
              <strong>Seating Capacity:</strong> {vehicle.seating_capacity}
            </p>
            <p className={`text-${theme === "dark" ? "gray-300" : "gray-900"} text-lg`}>
              <strong>Description:</strong> {vehicle.description || "N/A"}
            </p>

          </div>

          <div className="space-y-6">
            {vehicle.image && (
              <div className="mt-4">
                <img
                  src={`http://127.0.0.1:8000/storage/${vehicle.image}`}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-auto object-contain rounded-lg shadow-xl transition duration-300 transform hover:scale-105"
                />
              </div>
            )}

            {/* Media Upload Section */}
            <div className="mt-6">
              <input
                type="file"
                multiple
                onChange={handleMediaChange}
                className="border p-2 rounded-md transition duration-300 w-full"
              />
              <button
                onClick={handleMediaUpload}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4 transition duration-300 w-full sm:w-auto"
              >
                Upload Media
              </button>
            </div>

            {/* View Media Button */}
            {vehicle.media && vehicle.media.length > 0 && (
              <button
                onClick={toggleMediaVisibility}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 w-full sm:w-auto"
              >
                {viewMedia ? "Hide Media" : "View Media"}
              </button>
            )}

            {/* Display uploaded media if visible */}
            {viewMedia && vehicle.media && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {vehicle.media.map((mediaItem) => (
                  <div
                    key={mediaItem.id}
                    className="cursor-pointer group relative overflow-hidden rounded-lg transition duration-300 hover:scale-105"
                    onClick={() =>
                      navigate("/media-viewer", {
                        state: {
                          mediaItem,
                          mediaList: vehicle.media,
                          vehicleId: vehicle.id,
                        },
                      })
                    }
                  >
                    <img
                      src={`http://127.0.0.1:8000/storage/${mediaItem.file_path}`}
                      alt={`Media for ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-40 object-cover transform transition duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
};

export default Modify;
