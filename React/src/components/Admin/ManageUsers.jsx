import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import { FaUser } from "react-icons/fa";

const ManageUsers = () => {
    const [theme, setTheme] = useState(localStorage.getItem("adminTheme") || "dark");
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const tokenFromLocalStorage = localStorage.getItem("auth_token");
        if (tokenFromLocalStorage == null) {navigate('/signin')}
      },[])
    
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/users");
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch users. Please try again later.',
                });
            }

        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while fetching users. Please try again later.',
            });
        } finally {
            setLoading(false);
        }

    };

    const deleteUser = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'User deleted successfully!',
                    text: 'The user has been removed from the system.',
                });
                fetchUsers();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to delete user',
                    text: 'There was an issue deleting the user. Please try again later.',
                });
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while deleting the user. Please try again later.',
            });
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
            {/* Navigation Bar */}
            <nav className={`sticky top-0 z-50 ${theme === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-lg transition-colors duration-300`}>
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
                                    <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${theme === "dark" ? "bg-gray-700" : "bg-white"
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
                                                Pending Vehicle
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
                                        }`}
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

            {/* Mobile Menu */}
            {menuOpen && (
                <div className={`md:hidden transition-all duration-300 ${theme === "dark" ? "bg-gray-800" : "bg-white"
                    } shadow-lg`}>
                    <div className="px-4 py-3 space-y-3">
                        <button onClick={() => navigate("/admin-dashboard")}
                            className="block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors duration-300">
                            Home
                        </button>
                        <button onClick={() => navigate("/Admin/AddVehicle")}
                            className="block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors duration-300">
                            Manage Vehicle
                        </button>
                        <button onClick={() => navigate("/Admin/ManageUsers")}
                            className="block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors duration-300">
                            Manage Users
                        </button>
                        <button onClick={() => navigate("/Admin/Appointments")}
                            className="block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors duration-300">
                            Appointments
                        </button>
                        <div onClick={toggleTheme} className="flex items-center gap-2 px-4 py-2 cursor-pointer">
                            {theme === "dark" ? (
                                <BiSolidSun className="text-2xl" />
                            ) : (
                                <BiSolidMoon className="text-2xl" />
                            )}
                            <span>Toggle Theme</span>
                        </div>
                        <button onClick={handleLogout}
                            className="block w-full px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-400 transition-all duration-300">
                            Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-3xl font-bold mb-8">Manage Users</h2>

                {loading ? (
                    <div className="flex justify-center items-center mt-8">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className={theme === "dark" ? "bg-gray-800" : "bg-gray-50"}>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-gray-200 ${theme === "dark" ? "bg-gray-700" : "bg-white"
                                }`}>
                                {users.map((user) => (
                                    <tr key={user.id} className={`transition-colors duration-300 ${theme === "dark"
                                        ? "hover:bg-gray-600"
                                        : "hover:bg-gray-50"
                                        }`}>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button onClick={() => deleteUser(user.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors duration-300">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ManageUsers;