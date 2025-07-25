import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      // Optionally store user info in state/context
      navigate("/analyze"); // Redirect to analysis page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#e3e3e3] min-h-screen flex flex-col justify-center items-center px-4 font-['Inter']">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-1">
          Excel Analytics Platform
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Sign in to your account to continue
        </p>

        <form className="bg-white p-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-900 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-200 placeholder-gray-500 text-gray-900 text-sm px-3 py-2 focus:outline-none"
            />
          </div>

          <div className="mb-2 flex justify-between items-center">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-900"
            >
              Password
            </label>
            <a href="#" className="text-indigo-700 text-sm hover:underline">
              Forgot password?
            </a>
          </div>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-200 text-gray-900 text-sm px-3 py-2 mb-4 focus:outline-none"
          />

          <div className="mb-6 flex items-center space-x-2">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded-sm text-indigo-700 focus:ring-purple-500"
            />
            <label
              htmlFor="remember"
              className="text-sm text-gray-900 select-none"
            >
              Remember me for 30 days
            </label>
          </div>

          {error && <div className="text-red-500 mb-2">{error}</div>}

          <button
            type="submit"
            className="w-full cursor-pointer bg-indigo-700 text-white font-semibold py-2 rounded-sm hover:bg-indigo-800 transition"
          >
            Sign in
          </button>
        </form>

        <div className="bg-white p-6 mt-0 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500 mb-4 tracking-wide">
            OR CONTINUE WITH
          </p>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="flex items-center gap-2 border border-gray-300 rounded px-4 py-1 text-sm font-semibold text-gray-900 hover:bg-gray-100"
            >
              <i className="fas fa-plus"></i> Google
            </button>
            <button
              type="button"
              className="flex items-center gap-2 border border-gray-300 rounded px-4 py-1 text-sm font-semibold text-gray-900 hover:bg-gray-100"
            >
              <i className="fas fa-heart"></i> Microsoft
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm my-2">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-700 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;