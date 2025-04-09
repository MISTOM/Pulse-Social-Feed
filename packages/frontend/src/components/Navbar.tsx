import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeClass = "text-white hover:text-blue-200 px-3 py-2 rounded-md font-medium";
  const inactiveClass = "text-white hover:text-blue-200 px-3 py-2 rounded-md font-medium";

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img src="/1114.jpg" alt="Logo" className="h-8 w-auto mr-2" />
          <span className="text-white font-bold text-xl">Pulse</span>
        </Link>
        </div>
        <div className="flex space-x-4">
        {isAuthenticated ? (
          <>
                <NavLink 
                  to="/feed" 
                  className={({ isActive }) => isActive ? activeClass : inactiveClass}
                >
                  Feed
                </NavLink>
                <NavLink 
                  to="/following" 
                  className={({ isActive }) => isActive ? activeClass : inactiveClass}
                >
                  Following
                </NavLink>
                <NavLink 
                  to={`/profile/${user?.username}`} 
                  className={({ isActive }) => isActive ? activeClass : inactiveClass}
                >
                  Profile
                </NavLink>
                <button 
                  onClick={handleLogout} 
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;