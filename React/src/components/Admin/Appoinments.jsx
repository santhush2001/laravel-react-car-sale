import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import { FaUser } from "react-icons/fa";

const Appointments = () => {
    const [testDrives, setTestDrives] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("adminTheme") || "light");
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const tokenFromLocalStorage = localStorage.getItem("auth_token");
        if (tokenFromLocalStorage == null) {navigate('/signin')}
      },[])

    useEffect(() => {
        fetchTestDrives();
    }, []);

    const fetchTestDrives = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/testdrives");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setTestDrives(data);
        } catch (err) {
            console.error("Error fetching test drives:", err.message);
            setError("Failed to fetch test drives. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const deleteTestDrive = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this test drive?");
        if (!isConfirmed) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/testdrives/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setTestDrives(testDrives.filter((drive) => drive.id !== id));
                console.log("Test drive deleted successfully");
            } else if (response.status === 404) {
                console.error("Test drive not found");
            } else {
                console.error("Failed to delete test drive");
            }
        } catch (error) {
            console.error("Error deleting test drive:", error);
        }
    };

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
        localStorage.setItem("adminTheme", theme === "dark" ? "light" : "dark");
      };

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("role");
        navigate("/signin");
    };

    const handleAdminProfileClick = () => navigate("/Adminprofile");

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
            }`}>
            {/* Navigation */}
            <nav className={`sticky top-0 z-50 shadow-lg transition-all duration-300 ${theme === "dark" ? "bg-gray-800/95 backdrop-blur-sm" : "bg-white/95 backdrop-blur-sm"
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Admin</span>
                            <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Dashboard</span>
                        </h1>

                        <div className="hidden md:flex items-center space-x-4">
                            <button onClick={() => navigate("/admin-dashboard")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${theme === "dark"
                                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                    }`}>
                                Home
                            </button>

                            <div className="relative">
                                <button onClick={toggleDropdown}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${theme === "dark"
                                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                        }`}>
                                    Manage Vehicle
                                    <span className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}>▼</span>
                                </button>

                                {dropdownOpen && (
                                    <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 transform transition-all duration-300 ${theme === "dark" ? "bg-gray-700" : "bg-white"
                                        }`}>
                                        <div className="py-1">
                                            <button onClick={() => navigate("/Admin/AddVehicle")}
                                                className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-300 ${theme === "dark"
                                                    ? "text-white hover:bg-gray-600"
                                                    : "text-gray-900 hover:bg-gray-100"
                                                    }`}>
                                                Add Vehicle
                                            </button>
                                            <button onClick={() => navigate("/Admin/ViewVehicle")}
                                                className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-300 ${theme === "dark"
                                                    ? "text-white hover:bg-gray-600"
                                                    : "text-gray-900 hover:bg-gray-100"
                                                    }`}>
                                                View Vehicle
                                            </button>
                                            <button onClick={() => navigate("/Admin/PendingVehicles")}
                                                className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-300 ${theme === "dark"
                                                    ? "text-white hover:bg-gray-600"
                                                    : "text-gray-900 hover:bg-gray-100"
                                                    }`}>
                                                Pending Vehicle
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button onClick={() => navigate("/Admin/ManageUsers")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${theme === "dark"
                                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                    }`}>
                                Manage Users
                            </button>

                            <button onClick={() => navigate("/Admin/Appointments")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${theme === "dark"
                                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                    }`}>
                                Appointments
                            </button>

                            <div className="flex items-center space-x-4">
                                <FaUser onClick={handleAdminProfileClick}
                                    className={`text-2xl cursor-pointer transition-all duration-300 transform hover:scale-110 ${theme === "dark" ? "text-white hover:text-blue-400" : "text-gray-900 hover:text-blue-500"
                                        }`}
                                />

                                {theme === "dark" ? (
                                    <BiSolidSun onClick={toggleTheme}
                                        className="text-2xl cursor-pointer text-white hover:text-yellow-300 transition-all duration-300 transform hover:scale-110"
                                    />
                                ) : (
                                    <BiSolidMoon onClick={toggleTheme}
                                        className="text-2xl cursor-pointer text-gray-900 hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
                                    />
                                )}

                                <button onClick={handleLogout}
                                    className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-400 transition-all duration-300 transform hover:scale-105">
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

            <main className="max-w-7xl mx-auto p-6">
                <div className={`mb-8 p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}>
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                        Manage Test Drives
                    </h2>

                    {loading ? (
                        <div className="flex justify-center items-center mt-8">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="p-4 rounded-lg bg-red-100 border border-red-400 text-red-700">
                            {error}
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg">
                            <table className="min-w-full border-collapse">
                                <thead className={`${theme === "dark" ? "bg-gray-700" : "bg-blue-500"
                                    }`}>
                                    <tr>
                                        <th className="px-6 py-4 text-left text-white font-semibold">User</th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Vehicle</th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Time</th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testDrives.map((drive) => (
                                        <tr key={drive.id} className={`transition-colors duration-300 ${theme === "dark"
                                            ? "bg-gray-800 hover:bg-gray-700"
                                            : "bg-white hover:bg-gray-50"
                                            }`}>
                                            <td className="px-6 py-4 border-t border-gray-200">{drive.user_id}</td>
                                            <td className="px-6 py-4 border-t border-gray-200">{drive.vehicle_id}</td>
                                            <td className="px-6 py-4 border-t border-gray-200">{drive.test_drive_date}</td>
                                            <td className="px-6 py-4 border-t border-gray-200">{drive.test_drive_time}</td>
                                            <td className="px-6 py-4 border-t border-gray-200">
                                                <span className={`px-3 py-1 rounded-full text-sm ${drive.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : drive.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {drive.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 border-t border-gray-200">
                                                <button
                                                    onClick={() => deleteTestDrive(drive.id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors duration-300"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Appointments;