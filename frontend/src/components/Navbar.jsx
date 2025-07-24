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
    <nav className="bg-gray-100 p-4 shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/" className="text-gray-800 font-bold text-xl">
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/analyze" className="text-gray-600 hover:text-gray-800 mt-1">
                Analyze
              </Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 mt-1">
                Dashboard
              </Link>
            </>
          )}
        </div>
        <div className="flex space-x-4">
          {isLoggedIn ? (
            <>
              {/* Optionally add a logout button */}
              <button
                onClick={handleLogout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-1 mt-1 rounded-md transition ease-in-out duration-150 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-1 mt-1 rounded-md transition ease-in-out duration-150 cursor-pointer">
                Sign In
              </Link>
              <Link to="/signup" className="border border-indigo-600 text-indigo-600 hover:bg-gray-200 px-4 py-1 mt-1 rounded-md transition ease-in-out duration-150 cursor-pointer">
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