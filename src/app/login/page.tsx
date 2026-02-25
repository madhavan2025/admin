"use client";
import { useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import Image from "next/image";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Both email and password are required");
      return;
    }

    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        window.location.reload();
      } else {
        setError("Email or password is incorrect");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl flex overflow-hidden">

        {/* LEFT SIDE - FORM */}
        <div className="w-full lg:w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-6">Sign In</h2>

          {/* Google Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 mb-6 hover:bg-gray-50 transition"
          >
            <FaGoogle className="text-red-500" />
            Sign in with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">
              Or sign in with email
            </span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                {form.password && (
                  <span
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                )}
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="accent-indigo-600" />
                Remember me
              </label>
              <Link
                href="#"
                className="text-indigo-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-600 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>

       {/* RIGHT SIDE - WELCOME PANEL */}
<div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white items-center justify-center p-12">
  <div className="text-center max-w-md">
    <h3 className="text-lg mb-2">NextAdmin</h3>

    <h1 className="text-4xl font-bold mb-4">
      Welcome Back!
    </h1>

    <p className="text-indigo-100 mb-6">
      Please sign in to your account by completing
      the necessary fields.
    </p>

    {/* 🔹 Added Image Below Text */}
    <div className="flex justify-center">
      <Image
        src="/images/login.jpg"   // 👈 change image name if needed
        alt="Login Illustration"
        width={350}
        height={350}
        className="rounded-lg"
        priority
      />
    </div>
  </div>
</div>
      </div>
    </div>
  );
}