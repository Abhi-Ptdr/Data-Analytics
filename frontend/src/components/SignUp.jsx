import { useState } from "react";
import { Link } from "react-router-dom";

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        try {
            const res = await fetch("/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Signup failed");
            alert("Signup successful! You can now sign in.");
            window.location.href = "/signin";
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-[#e3e3e3] min-h-screen flex flex-col justify-center items-center px-4 font-['Inter']">
            <div className="max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <img
                        src="https://storage.googleapis.com/a1aa/image/b57c8051-2afd-4bc2-087f-cdfd5c24238f.jpg"
                        width="80"
                        height="80"
                        alt="Logo"
                        className="w-20 h-20"
                    />
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-1">
                    Excel Analytics Platform
                </h1>
                <p className="text-center text-gray-500 mb-6">
                    Create your account to get started
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
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-900"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-200 text-gray-900 text-sm px-3 py-2 mb-1 focus:outline-none"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="confirm"
                            className="block text-sm font-semibold text-gray-900"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirm"
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="w-full bg-gray-200 text-gray-900 text-sm px-3 py-2 mb-1 focus:outline-none"
                            required
                        />
                    </div>

                    {error && <div className="text-red-500 mb-2">{error}</div>}

                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white font-semibold py-2 rounded-sm hover:bg-purple-700 transition"
                    >
                        Sign up
                    </button>
                </form>

                <div className="bg-white p-6 mt-0 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-500 mb-4 tracking-wide">
                        OR CONTINUE WITH
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            type="button"
                            className="flex items-center gap-2 border border-gray-300 rounded px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                        >
                            <i className="fas fa-plus"></i> Google
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-2 border border-gray-300 rounded px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                        >
                            <i className="fas fa-heart"></i> Microsoft
                        </button>
                    </div>
                </div>

                <p className="text-center text-gray-500 text-sm my-2">
                    Already have an account?{" "}
                    <Link to="/signin" className="text-purple-600 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp;