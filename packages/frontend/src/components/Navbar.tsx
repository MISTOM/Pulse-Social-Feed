import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">Social Feed</Link>
          </div>
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/feed" 
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md font-medium"
                >
                  Feed
                </Link>
                <Link 
                  to={`/profile/${user?.username}`} 
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md font-medium"
                >
                  Profile
                </Link>
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