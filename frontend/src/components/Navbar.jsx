import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const [isOpen, setIsOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/" className="text-white text-2xl font-bold">
          ExcelVisualizer
        </Link>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-white hover:text-gray-200 transition duration-200"
          >
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
        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="cursor-pointer bg-white text-indigo-600 font-semibold px-4 py-1 rounded-md shadow hover:bg-gray-100 transition duration-200"
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
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.3 5.71a1 1 0 00-1.42-1.42L12 9.17 7.12 4.29A1 1 0 105.7 5.71l4.88 4.88-4.88 4.88a1 1 0 101.42 1.42L12 11.83l4.88 4.88a1 1 0 001.42-1.42l-4.88-4.88 4.88-4.88z"
                />
              ) : (
                <path fillRule="evenodd" d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/"
              className="block text-white hover:text-gray-200 transition duration-200"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  to="/analyze"
                  className="block text-white hover:text-gray-200 transition duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Analyze
                </Link>
                <Link
                  to="/dashboard"
                  className="block text-white hover:text-gray-200 transition duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}
            <div className="pt-2 border-t border-indigo-300">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left bg-white text-indigo-600 font-semibold px-4 py-1 rounded-md shadow hover:bg-gray-100 transition duration-200"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="block bg-white text-indigo-600 font-semibold px-4 py-1 rounded-md shadow hover:bg-gray-100 transition duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block bg-white text-indigo-600 font-semibold px-4 py-1 rounded-md shadow hover:bg-gray-100 transition duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;