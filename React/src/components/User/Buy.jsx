import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";


Modal.setAppElement("#root");

const Buy = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("userTheme") || "light");
  const [modalOpen, setModalOpen] = useState(false);
  const [testDriveDate, setTestDriveDate] = useState("");
  const [testDriveTime, setTestDriveTime] = useState("");
  const [note, setNote] = useState("");
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
          Swal.fire({
            icon: "error",
            title: "Failed to Fetch",
            text: "Failed to fetch vehicle details.",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while fetching vehicle details.",
        });
      } finally {
        setLoading(false);
      }
    };


    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("user_id", data.id);
        } else {
          // Swal.fire({
          //   icon: "error",
          //   title: "Fetch Failed",
          //   text: "Failed to fetch user data.",
          // });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while fetching user data.",
        });
      }
    };


    fetchVehicleDetails();
    fetchUserProfile();
  }, [id]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleTestDriveSubmit = async () => {
    if (testDriveDate && testDriveTime) {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/test-drives", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: localStorage.getItem("user_id"),
            vehicle_id: vehicle.id,
            test_drive_date: testDriveDate,
            test_drive_time: testDriveTime,
            note,
            status: "pending",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: data.message,
          }).then(() => {
            closeModal();
          });
        } else {
          const errorData = await response.json();
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `Error: ${errorData.message}`,
          });
        }


      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while scheduling the test drive.",
        });
      }

    } else {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Selection",
        text: "Please select a date and time for the test drive.",
      });
    }

  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "You cannot select a past date.",
      });
      setTestDriveDate("");
      return;
    }

    setTestDriveDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    const currentDate = new Date();
    const selectedDate = new Date(`${testDriveDate}T${e.target.value}`);

    if (testDriveDate && selectedDate < currentDate) {
      Swal.fire({
        icon: "error",
        title: "Invalid Time",
        text: "You cannot select a past time.",
      });
      setTestDriveTime("");
      return;
    }

    setTestDriveTime(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    navigate('/signin');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!vehicle) {
    return <div className="min-h-screen flex items-center justify-center">Vehicle not found</div>;
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Enhanced Header */}
      <header className={`sticky top-0 z-50 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  DriveLine
                </span>
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


        <div className={`rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} overflow-hidden`}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {vehicle.make} {vehicle.model}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Vehicle Details */}
              <div className="space-y-4">
                <DetailItem label="Year" value={vehicle.year} theme={theme} />
                <DetailItem label="Price" value={`Lkr.${vehicle.price}`} theme={theme} />
                <DetailItem label="Mileage" value={`${vehicle.mileage} miles`} theme={theme} />
                <DetailItem label="Condition" value={vehicle.condition} theme={theme} />
                <DetailItem label="Engine Type" value={vehicle.engine_type} theme={theme} />
                <DetailItem label="Transmission" value={vehicle.transmission} theme={theme} />
                <DetailItem label="Fuel Type" value={vehicle.fuel_type} theme={theme} />
                <DetailItem label="Seating Capacity" value={vehicle.seating_capacity} theme={theme} />

                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                    {vehicle.description || "N/A"}
                  </p>
                </div>
              </div>

              {/* Vehicle Image and Actions */}
              <div className="space-y-6">
                {vehicle.image && (
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <img
                      src={`http://127.0.0.1:8000/storage/${vehicle.image}`}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-[400px] object-cover transform transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={openModal}
                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md"
                  >
                    Schedule Test Drive
                  </button>

                  {vehicle.media && vehicle.media.length > 0 && (
                    <button
                      onClick={() =>
                        navigate("/user-media-viewer", {
                          state: {
                            mediaItem: vehicle.media[0],
                            mediaList: vehicle.media,
                            vehicleId: vehicle.id,
                          },
                        })
                      }
                      className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 shadow-md"
                    >
                      View Media
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Schedule Test Drive"
        className={`modal w-full max-w-lg p-6 rounded-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-xl ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      >
        <h2 className="text-2xl font-bold mb-6">Schedule a Test Drive</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-2">Select Date:</label>
            <input
              type="date"
              className={`w-full p-2 rounded-lg border ${theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
                }`}
              value={testDriveDate}
              onChange={handleDateChange}
            />
          </div>

          <div>
            <label className="block mb-2">Select Time:</label>
            <input
              type="time"
              className={`w-full p-2 rounded-lg border ${theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
                }`}
              value={testDriveTime}
              onChange={handleTimeChange}
            />
          </div>

          <div>
            <label className="block mb-2">Add Notes:</label>
            <textarea
              className={`w-full p-2 rounded-lg border ${theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
                }`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add contact details or special notes"
              rows="4"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={closeModal}
              className={`px-4 py-2 rounded-lg ${theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              Cancel
            </button>
            <button
              onClick={handleTestDriveSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Helper component for vehicle details
const DetailItem = ({ label, value, theme }) => (
  <div className={`flex justify-between p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
    <span className="font-semibold">{label}:</span>
    <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>{value}</span>
  </div>
);

export default Buy;