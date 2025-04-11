import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSolidSun, BiSolidMoon } from 'react-icons/bi';
import { FaUser, FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('userTheme') || 'light');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
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
          setUpdatedUser({
            name: data.name,
            email: data.email,
            password: '',
            password_confirmation: ''
          });
        } else {
          alert('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('An error occurred while fetching user data');
      }
    };
    fetchUserProfile();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('userTheme', newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    navigate('/signin');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedUser({
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: ''
    });
  };

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
          title: 'Success!',
          text: 'Profile updated successfully!',
          confirmButtonText: 'Ok'
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: `Failed to update profile: ${JSON.stringify(errorData)}`,
          confirmButtonText: 'Try Again'
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while updating the profile.',
        confirmButtonText: 'Ok'
      });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone. Do you want to delete your account?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (confirmDelete.isConfirmed) {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`http://127.0.0.1:8000/api/users/${user.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Account deleted successfully!',
            confirmButtonText: 'Ok'
          }).then(() => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('role');
            navigate('/signin'); // Redirect after deletion
          });
        } else {
          const errorData = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Failed to delete account: ${JSON.stringify(errorData)}`,
            confirmButtonText: 'Try Again'
          });
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred while deleting the account.',
          confirmButtonText: 'Ok'
        });
      }
    }
  };
  const handleBack = () => {
    navigate('/user-dashboard');
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
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
                onClick={() => navigate("/ViewSchedule")}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faCalendar} className="text-xl text-purple-500" />
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className={`rounded-lg shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200">
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                  <FaUser className="w-16 h-16" />
                </div>
              </div>
            </div>
          </div>
          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            <form className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={updatedUser.name}
                    disabled={!isEditing}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                    className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                      : 'bg-gray-50 border-gray-300 focus:border-blue-500'
                      } ${isEditing ? 'focus:ring-2 focus:ring-blue-500' : 'cursor-not-allowed'} transition-colors`}
                  />
                </div>
              </div>
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={updatedUser.email}
                    disabled={!isEditing}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                    className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                      : 'bg-gray-50 border-gray-300 focus:border-blue-500'
                      } ${isEditing ? 'focus:ring-2 focus:ring-blue-500' : 'cursor-not-allowed'} transition-colors`}
                  />
                </div>
              </div>
              {/* Password Field */}
              {isEditing && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={updatedUser.password}
                      onChange={(e) => setUpdatedUser({
                        ...updatedUser,
                        password: e.target.value,
                        password_confirmation: e.target.value,
                      })}
                      placeholder="Enter new password (optional)"
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                        : 'bg-gray-50 border-gray-300 focus:border-blue-500'
                        } focus:ring-2 focus:ring-blue-500 transition-colors`}
                    />
                  </div>
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                {isEditing ? (
                  <>
                 
                 <button
  type="button"
  onClick={handleCancel}
  className="px-6 py-2 rounded-lg border border-red-500 text-red-600 dark:border-red-600 dark:text-red-600 transition-colors"
>
  Cancel
</button>
      <button
        type="button"
        onClick={handleSave}
        className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-colors"
      >
        Save Changes
      </button>
    </>
  ) : (
    <button
      type="button"
      onClick={handleEdit}
      className="px-6 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 transition-colors"
    >
      Edit Profile
    </button>
                )}
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-colors w-full"
                >
                  Delete My Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;