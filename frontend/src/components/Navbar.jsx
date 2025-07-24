import React from 'react';
import { Link, useNavigate  } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          ExcelVisualizer
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-white hover:text-gray-200 transition duration-200">
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link
                to="/analyze"
                className="text-white hover:text-gray-200 transition duration-200"
              >
                Analyze
              </Link>
              <Link
                to="/dashboard"
                className="text-white hover:text-gray-200 transition duration-200"
              >
                Dashboard
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-white text-indigo-600 font-semibold px-4 py-1 rounded-md shadow hover:bg-gray-100 transition duration-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/signin"
                className="bg-white text-indigo-600 font-semibold px-4 py-1 rounded-md shadow hover:bg-gray-100 transition duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-white text-indigo-600 font-semibold px-4 py-1 rounded-md shadow hover:bg-gray-100 transition duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;