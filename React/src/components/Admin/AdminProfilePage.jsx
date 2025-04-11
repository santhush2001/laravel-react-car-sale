import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSolidSun, BiSolidMoon } from 'react-icons/bi';
import { FaUser, FaEdit, FaSave } from 'react-icons/fa';
import { HiMenuAlt1, HiMenuAlt3 } from 'react-icons/hi';

const AdminProfilePage = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('adminTheme') || 'light');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("auth_token");
    if (tokenFromLocalStorage == null) {navigate('/signin')}
  },[])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setUpdatedUser({ name: data.name, email: data.email, password: '', password_confirmation: '' });
        } else {
          const errorData = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'Fetch Error',
            text: `Failed to fetch user data: ${errorData.message || 'Unknown error'}`,
          });
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
        // Swal.fire({
        //   icon: 'error',
        //   title: 'Fetch Error',
        //   text: 'An error occurred while fetching user data. Please try again later.',
        // });
      }

    };

    fetchUserProfile();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("adminTheme", newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    navigate('/signin');
  };

  const handleEdit = () => setIsEditing(true);
  const handleAdminBack = () => navigate('/admin-dashboard');
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://127.0.0.1:8000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsEditing(false);
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: data.message,
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: `Failed to update profile: ${JSON.stringify(errorData)}`,
        });
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating the profile. Please try again later.',
      });
    }

  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 shadow-lg transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-3xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Admin</span>
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Dashboard</span>
            </h1>

            <div className="hidden md:flex items-center space-x-4">
              <button onClick={() => navigate("/admin-dashboard")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}>
                Home
              </button>

              <div className="relative">
                <button onClick={toggleDropdown}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}>
                  Manage Vehicle
                  <span className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {dropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                    } ring-1 ring-black ring-opacity-5 transform transition-all duration-300`}>
                    <div className="py-1">
                      <button onClick={() => navigate("/Admin/AddVehicle")}
                        className={`block w-full text-left px-4 py-2 text-sm ${theme === 'dark'
                          ? 'text-white hover:bg-gray-600'
                          : 'text-gray-900 hover:bg-gray-100'
                          }`}>
                        Add Vehicle
                      </button>
                      <button onClick={() => navigate("/Admin/ViewVehicle")}
                        className={`block w-full text-left px-4 py-2 text-sm ${theme === 'dark'
                          ? 'text-white hover:bg-gray-600'
                          : 'text-gray-900 hover:bg-gray-100'
                          }`}>
                        View Vehicle
                      </button>
                      <button onClick={() => navigate("/Admin/PendingVehicles")}
                        className={`block w-full text-left px-4 py-2 text-sm ${theme === 'dark'
                          ? 'text-white hover:bg-gray-600'
                          : 'text-gray-900 hover:bg-gray-100'
                          }`}>
                        Pending Vehicle
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => navigate("/Admin/ManageUsers")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}>
                Manage Users
              </button>

              <button onClick={() => navigate("/Admin/Appointments")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}>
                Appointments
              </button>

              <div className="flex items-center space-x-4">
                <FaUser onClick={handleAdminBack}
                  className={`text-2xl cursor-pointer transition-all duration-300 transform hover:scale-110 ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-500'
                    }`}
                />

                {theme === 'dark' ? (
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

      {/* Profile Content */}
      <main className="max-w-4xl mx-auto p-6">
        <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              Profile Details
            </h2>

            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={updatedUser.name}
                  onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                    } ${!isEditing && 'opacity-75'}`}
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={updatedUser.email}
                  onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                    } ${!isEditing && 'opacity-75'}`}
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={updatedUser.password}
                  onChange={(e) => setUpdatedUser({
                    ...updatedUser,
                    password: e.target.value,
                    password_confirmation: e.target.value,
                  })}
                  disabled={!isEditing}
                  placeholder="Enter new password"
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                    } ${!isEditing && 'opacity-75'}`}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105"
                >
                  <FaSave className="text-lg" />
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all duration-300 transform hover:scale-105"
                >
                  <FaEdit className="text-lg" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfilePage;