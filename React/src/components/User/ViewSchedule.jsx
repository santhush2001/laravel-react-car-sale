import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { FaCalendar, FaClock, FaEdit, FaTrash, FaBan, FaArrowLeft, FaCar, FaStickyNote, FaSignOutAlt } from "react-icons/fa";
import { faHome } from "@fortawesome/free-solid-svg-icons";
const ViewSchedule = () => {
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("userTheme") || "light");
  const [editData, setEditData] = useState({ date: "", time: "", note: "" });
  const [editingDrive, setEditingDrive] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("auth_token");
    if (tokenFromLocalStorage == null) {navigate('/signin')}
  },[])

  // Add theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("userTheme", newTheme);
  };

  // Add theme effect to sync with localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("userTheme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const fetchTestDrives = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          navigate('/signin'); // Redirect to login if no token
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/api/test-drives", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTestDrives(data);
        } else {
          throw new Error("Failed to fetch test drive appointments");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching test drive appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestDrives();
  }, [navigate]);

  const handleEdit = (drive) => {
    setEditingDrive(drive.id);
    setEditData({
      date: drive.test_drive_date,
      time: drive.test_drive_time,
      note: drive.note || "",
    });
  };

  const handleSave = async () => {
    if (!editData.date || !editData.time) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields!',
        text: 'Please fill in all required fields.',
        confirmButtonText: 'Ok'
      });
      return;
    }


    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/test-drives/${editingDrive}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test_drive_date: editData.date,
          test_drive_time: editData.time,
          note: editData.note,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }

      const updatedDrive = await response.json();
      const updatedTestDrives = testDrives.map((drive) =>
        drive.id === editingDrive ? { ...drive, ...updatedDrive.testDrive } : drive
      );
      setTestDrives(updatedTestDrives);
      setEditingDrive(null);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Test drive updated successfully!',
        confirmButtonText: 'Ok'
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: `Failed to update: ${error.message}`,
        confirmButtonText: 'Try Again'
      });
    }

  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (confirmCancel) {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(`http://127.0.0.1:8000/api/test-drives/${id}/cancel`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "cancelled" }),
        });

        if (response.ok) {
          const updatedTestDrives = testDrives.map((drive) =>
            drive.id === id ? { ...drive, status: "cancelled" } : drive
          );
          setTestDrives(updatedTestDrives);
        } else {
          throw new Error("Failed to cancel appointment");
        }
      } catch (error) {
        console.error("Error:", error);
        alert(error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this appointment?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    });

    if (confirmDelete.isConfirmed) {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(`http://127.0.0.1:8000/api/test-drives/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setTestDrives(testDrives.filter((drive) => drive.id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The appointment has been deleted.',
            confirmButtonText: 'Ok'
          });
        } else {
          throw new Error("Failed to delete appointment");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: error.message,
          confirmButtonText: 'Try Again'
        });
      }
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    navigate('/signin');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    // Check if selected date is in the past
    if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date!',
        text: 'You cannot select a past date.',
        confirmButtonText: 'Ok'
      });
      setTestDriveDate(""); // Reset the invalid date
      return;
    }

    setTestDriveDate(e.target.value);
  };

  // Ensure past times are not selectable in the time picker
  const handleTimeChange = (e) => {
    const currentDate = new Date();
    const selectedDate = new Date(`${testDriveDate}T${e.target.value}`);

    // Check if the selected time is in the past
    if (testDriveDate && selectedDate < currentDate) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Time!',
        text: 'You cannot select a past time.',
        confirmButtonText: 'Ok'
      });
      setTestDriveTime(""); // Reset the invalid time
      return;
    }

    setTestDriveTime(e.target.value);
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                DriveLine
              </h1>
            </div>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Test Drive Schedule
            </h1>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/user-dashboard")}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faHome} className="text-xl text-blue-500" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === "dark" ? (
                  <BiSolidSun className="text-xl" />
                ) : (
                  <BiSolidMoon className="text-xl" />
                )}
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {testDrives.length === 0 ? (
          <div className="text-center py-12">
            <FaCar className="mx-auto text-6xl text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Test Drives Scheduled</h2>
            <p className="text-gray-500">You haven't scheduled any test drives yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testDrives.map((drive) => (
              <div
                key={drive.id}
                className={`rounded-lg shadow-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"} transform hover:scale-105 transition-transform duration-200`}
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                  <h2 className="text-xl font-bold text-white">
                    {drive.vehicle.make} {drive.vehicle.model}
                  </h2>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaCalendar className="text-blue-500" />
                    <span>{drive.test_drive_date}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaClock className="text-purple-500" />
                    <span>{drive.test_drive_time}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(drive.status)}`}>
                      {drive.status}
                    </span>
                  </div>

                  {drive.note && (
                    <div className="flex items-start space-x-3">
                      <FaStickyNote className="text-yellow-500 mt-1" />
                      <p className="text-sm">{drive.note}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      onClick={() => handleEdit(drive)}
                      className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => handleCancel(drive.id)}
                      className="p-2 text-yellow-500 hover:bg-yellow-100 rounded-full transition-colors"
                      title="Cancel"
                    >
                      <FaBan />
                    </button>

                    <button
                      onClick={() => handleDelete(drive.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingDrive && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className={`max-w-md w-full rounded-lg shadow-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6`}>
              <h2 className="text-2xl font-bold mb-6">Edit Test Drive</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      value={editData.date}
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        const currentDate = new Date();

                        // Reset time to 00:00:00 for accurate comparison
                        currentDate.setHours(0, 0, 0, 0);

                        if (selectedDate < currentDate) {
                          Swal.fire({
                            icon: 'error',
                            title: 'Invalid Date!',
                            text: 'You cannot select a past date.',
                            confirmButtonText: 'Ok'
                          });
                          setEditData({ ...editData, date: "" }); // Reset the invalid date
                          return;
                        }

                        setEditData({ ...editData, date: e.target.value });
                      }}
                      className={`w-full p-2 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                        }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <input
                      type="time"
                      value={editData.time}
                      onChange={(e) => {
                        const currentDate = new Date();
                        const selectedDate = new Date(`${editData.date}T${e.target.value}`);

                        if (!editData.date) {
                          Swal.fire({
                            icon: 'warning',
                            title: 'No Date Selected!',
                            text: 'Please select a date first.',
                            confirmButtonText: 'Ok'
                          });
                          setEditData({ ...editData, time: "" });
                          return;
                        }

                        if (selectedDate < currentDate) {
                          Swal.fire({
                            icon: 'error',
                            title: 'Invalid Time!',
                            text: 'You cannot select a past time.',
                            confirmButtonText: 'Ok'
                          });
                          setEditData({ ...editData, time: "" }); // Reset the invalid time
                          return;
                        }

                        setEditData({ ...editData, time: e.target.value });
                      }}
                      className={`w-full p-2 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                        }`}
                    />
                  </div>

                </div>


                <div>
                  <label className="block text-sm font-medium mb-2">Note</label>
                  <textarea
                    value={editData.note}
                    onChange={(e) => setEditData({ ...editData, note: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}
                    rows="3"
                  />
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                <button
  onClick={() => setEditingDrive(null)}
  className="px-4 py-2 rounded-lg border border-red-300 bg-red-500 text-white hover:bg-red-600 transition-colors"
>
  Cancel
</button>
<button
  onClick={handleSave}
  className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
>
  Save Changes
</button>

                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewSchedule;
