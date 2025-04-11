import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi"; // Icons for theme toggle
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi"; // Icons for mobile menu
import { FaUser } from "react-icons/fa"; // Import user icon

const VehicleDetails = () => {
  const { id } = useParams(); // Get the vehicle ID from the route
  const [vehicle, setVehicle] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("adminTheme") || "dark");
  const [viewMedia, setViewMedia] = useState(false); // State to control media visibility
  const [dropdownOpen, setDropdownOpen] = useState(false); // For dropdown menu
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("auth_token");
    if (tokenFromLocalStorage == null) {navigate('/signin')}
  },[])

  // Update the theme in localStorage and apply the class
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("adminTheme", newTheme);
  };

  // Handle menu toggle (for mobile view)
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Handle dropdown menu toggle
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/vehicles/${id}`);
        if (response.ok) {
          const data = await response.json();
          setVehicle(data);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed to fetch vehicle details',
            text: 'There was an issue retrieving the vehicle details. Please try again later.',
          });
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: 'error',
          title: 'An error occurred',
          text: 'An error occurred while fetching vehicle details. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);


  // Handle media file upload
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
        const data = await response.json();
        setVehicle((prevVehicle) => ({
          ...prevVehicle,
          media: [...prevVehicle.media, ...data.media],
        }));

        // SweetAlert for success
        Swal.fire({
          icon: 'success',
          title: 'Media Uploaded Successfully!',
          text: 'Your media has been successfully uploaded.',
        });

        // Wait for 2 seconds before reloading the page
        setTimeout(() => {
          window.location.reload(); // Refresh page after 2 seconds
        }, 2000);

      } else {
        // SweetAlert for error
        Swal.fire({
          icon: 'error',
          title: 'Failed to Upload Media',
          text: 'There was an issue uploading the media. Please try again.',
        });
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      // SweetAlert for exception
      Swal.fire({
        icon: 'error',
        title: 'An Error Occurred',
        text: 'An error occurred while uploading the media. Please try again.',
      });
    }
  };

  const toggleMediaVisibility = () => {
    setViewMedia(!viewMedia);
  };

  // Handle vehicle deletion
  const handleDelete = async () => {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (confirmDelete.isConfirmed) {
      try {
        // Check if the vehicle exists in the 'pending-vehicles' table first
        const responsePendingVehicles = await fetch(`http://127.0.0.1:8000/api/pending-vehicles/${id}`, {
          method: "GET", // Check for existence
        });

        let deletePending = false;
        if (responsePendingVehicles.ok) {
          // If found, mark for deletion from pending-vehicles table
          deletePending = true;
        }

        // Now, delete from the 'vehicles' table
        const responseVehicles = await fetch(`http://127.0.0.1:8000/api/vehicles/${id}`, {
          method: "DELETE",
        });

        if (responseVehicles.ok) {
          if (deletePending) {
            // If the vehicle was also in the 'pending-vehicles' table, delete it there as well
            const responsePendingVehiclesDelete = await fetch(`http://127.0.0.1:8000/api/pending-vehicles/${id}/destroy`, {
              method: "POST",
            });

            if (responsePendingVehiclesDelete.ok) {
              Swal.fire({
                icon: 'success',
                title: 'Vehicle Deleted!',
                text: 'Vehicle deleted from both tables successfully.',
              });
            } else {
              const errorText = await responsePendingVehiclesDelete.text();
              console.error("Failed to delete from pending-vehicles:", errorText);
              Swal.fire({
                icon: 'error',
                title: 'Partial Deletion',
                text: 'Vehicle deleted from vehicles table but failed to delete from pending-vehicles.',
              });
            }
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Vehicle Deleted!',
              text: 'Vehicle deleted successfully from the vehicles table.',
            });
          }

          // Wait for 2 seconds before redirecting to View Vehicle page
          setTimeout(() => {
            navigate("/Admin/ViewVehicle");
          }, 2000);

        } else {
          const errorText = await responseVehicles.text();
          console.error("Failed to delete from vehicles:", errorText);
          Swal.fire({
            icon: 'error',
            title: 'Deletion Failed',
            text: 'Failed to delete vehicle from the vehicles table.',
          });
        }
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while deleting the vehicle.',
        });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("role");
    navigate("/signin");
  };

  const handleAdminProfileClick = () => {
    navigate("/Adminprofile");  // Navigate to the profile page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!vehicle) {
    return <div>Vehicle not found</div>;
  }

  return (
    <div className={`dashboard-layout ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen`}>
      {/* Navigation Bar */}
      <nav className={`sticky top-0 z-50 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg transition-colors duration-300`}>
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
                    }`
                  }
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


      <main className={`p-6 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
        <div className={`max-w-7xl mx-auto border p-8 rounded-xl shadow-lg mt-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"} transition-all duration-300 hover:shadow-2xl backdrop-blur-sm bg-opacity-95 ${theme === "dark" ? "dark:bg-opacity-95" : ""}`}>
          <h2 className={`text-4xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"} bg-gradient-to-r ${theme === "dark" ? "from-gray-100 to-gray-300" : "from-gray-900 to-gray-700"} bg-clip-text text-transparent`}>
            {vehicle.make} {vehicle.model}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              {[['Year', vehicle.year], ['Price', `Rs:${vehicle.price}`], ['Mileage', `${vehicle.mileage} miles`], ['Condition', vehicle.condition], ['Engine Type', vehicle.engine_type], ['Transmission', vehicle.transmission], ['Fuel Type', vehicle.fuel_type], ['Seating Capacity', vehicle.seating_capacity], ['Description', vehicle.description || 'N/A']].map(([label, value]) => (
                <div key={label} className={`group p-4 rounded-lg ${theme === "dark" ? "bg-gray-700/50 dark:hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"} transition-all duration-300`}>
                  <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    <span className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{label}:</span>{' '}
                    <span className={`group-hover:text-gray-900 ${theme === "dark" ? "dark:group-hover:text-white" : "transition-colors duration-300"}`}>
                      {value}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {vehicle.image && (
                <div className={`rounded-xl overflow-hidden p-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                  <img
                    src={`http://127.0.0.1:8000/storage/${vehicle.image}`}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-96 object-contain rounded-lg shadow-md transition-all duration-500 transform hover:scale-102"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex flex-col space-y-4">
                  <input
                    type="file"
                    multiple
                    onChange={handleMediaChange}
                    className={`file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${theme === "dark" ? "file:bg-blue-900 file:text-blue-200 hover:file:bg-blue-800 dark:hover:file:bg-blue-700" : "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"} transition-all duration-300`}
                  />
                  <button
                    onClick={handleMediaUpload}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                  >
                    Upload Media
                  </button>
                </div>

                {vehicle.media && vehicle.media.length > 0 && (
                  <button
                    onClick={toggleMediaVisibility}
                    className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                  >
                    {viewMedia ? "Hide Media" : "View Media"}
                  </button>
                )}
              </div>

              {viewMedia && vehicle.media && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                  {vehicle.media.map((mediaItem) => (
                    <div
                      key={mediaItem.id}
                      onClick={() => navigate("/media-viewer", {
                        state: { mediaItem, mediaList: vehicle.media, vehicleId: vehicle.id }
                      })}
                      className="group relative overflow-hidden rounded-xl cursor-pointer"
                    >
                      <img
                        src={`http://127.0.0.1:8000/storage/${mediaItem.file_path}`}
                        alt={`Media for ${vehicle.make} ${vehicle.model}`}
                        className="w-full h-40 object-cover transition-all duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate(`/edit-vehicle/${vehicle.id}`)}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-lg hover:shadow-xl"
            >
              Edit Vehicle
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-lg hover:shadow-xl"
            >
              Delete Vehicle
            </button>
          </div>
        </div>
      </main>
    </div>

  );
};

export default VehicleDetails;
