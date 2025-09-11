import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationSystem from "./NotificationSystem";
import profilePic from "../assets/assets_frontend/profile_pic.png";
import dropdownIcon from "../assets/assets_frontend/dropdown_icon.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isDoctor, isAdmin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <div className="relative z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between py-4 max-w-7xl mx-auto px-4">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-2xl">🏥</span>
          <h1 className="text-xl font-bold text-gray-900">HealthCare+</h1>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center gap-6 font-medium">
          <NavLink to={"/"} className={({ isActive }) => 
            isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
          }>
            <li>Home</li>
          </NavLink>
          <NavLink to={"/doctors"} className={({ isActive }) => 
            isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
          }>
            <li>Find Doctors</li>
          </NavLink>
          {isAuthenticated && (
            <NavLink to={isDoctor ? "/doctor/dashboard" : "/patient/dashboard"} className={({ isActive }) => 
              isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
            }>
              <li>Dashboard</li>
            </NavLink>
          )}
          <NavLink to={"/about"} className={({ isActive }) => 
            isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
          }>
            <li>About</li>
          </NavLink>
        </ul>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <button 
              onClick={() => navigate('/admin/login')} 
              className="hidden md:block text-gray-600 hover:text-gray-800 font-medium"
            >
              Admin
            </button>
          )}
          
b           {/* {isAuthenticated && <NotificationSystem />} */}
          
          {isAuthenticated ? (
            <div className="relative">
              <div 
                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                onClick={toggleDropdown}
              >
                <img 
                  className="w-8 h-8 rounded-full object-cover border" 
                  src={user?.profilePicture || profilePic} 
                  alt={user?.name || "Profile"} 
                />
                <span className="hidden md:block font-medium text-gray-700">{user?.name}</span>
                <img className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} src={dropdownIcon} alt="Dropdown" />
              </div>
              
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={closeDropdown} />
                  <div className="absolute top-12 right-0 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-sm text-gray-500">
                        {isAdmin ? 'Administrator' : isDoctor ? 'Doctor' : 'Patient'}
                      </p>
                    </div>
                    
                    {isAdmin ? (
                      <>
                        <button onClick={() => { navigate('/admin'); closeDropdown(); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">Admin Dashboard</button>
                        <button onClick={() => { navigate('/admin/doctors'); closeDropdown(); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">Manage Doctors</button>
                        <button onClick={() => { navigate('/admin/patients'); closeDropdown(); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">Manage Patients</button>
                      </>
                    ) : isDoctor ? (
                      <>
                        <button onClick={() => { navigate('/doctor/dashboard'); closeDropdown(); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">Dashboard</button>
                        <button onClick={() => { navigate('/doctor/appointments'); closeDropdown(); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">Appointments</button>
                        <button onClick={() => { navigate('/chat'); closeDropdown(); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">Messages</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { navigate('/patient/dashboard'); closeDropdown(); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">Dashboard</button>
                        <button onClick={() => { navigate('/patient/appointments'); closeDropdown(); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">My Appointments</button>
                        <button onClick={() => { navigate('/chat'); closeDropdown(); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">Chat</button>
                      </>
                    )}
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button onClick={() => { logout(); closeDropdown(); }} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Logout</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
