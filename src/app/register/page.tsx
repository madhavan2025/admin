"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // 🔹 Validation Functions
  const validateName = (name: string) => /^[A-Za-z\s]+$/.test(name);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    return rules;
  };

  const handleSubmit = async (e: any) => {
  e.preventDefault();
  setSubmitted(true); // 👈 ADD THIS
  setMessage("");

  let newErrors: any = {};

  if (!validateName(form.name)) {
    newErrors.name = "Name must contain letters only";
  }

  if (!validateEmail(form.email)) {
    newErrors.email = "Enter a valid email address";
  }

  const passwordRules = validatePassword(form.password);

  if (!passwordRules.length)
    newErrors.password = "Password must be at least 8 characters";

  else if (!passwordRules.uppercase)
    newErrors.password = "Password must include one uppercase letter";

  else if (!passwordRules.lowercase)
    newErrors.password = "Password must include one lowercase letter";

  else if (!passwordRules.number)
    newErrors.password = "Password must include one number";

  else if (!passwordRules.special)
    newErrors.password = "Password must include one special character";

  if (form.password !== form.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: form.name,
      email: form.email,
      password: form.password,
    }),
  });

  const data = await res.json();
  setMessage(data.message);
  setSuccess(res.ok);

  if (res.ok) {
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }
};

  const passwordRules = validatePassword(form.password);

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div className="bg-white rounded-2xl shadow-xl flex w-full max-w-5xl overflow-hidden">
      
      {/* LEFT SIDE - REGISTER FORM */}
      <div className="w-full lg:w-1/2 p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Sign Up
        </h2>

        {message && (
          <div
            className={`p-3 text-center rounded-md mb-4 ${
              success
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full p-3 border rounded-md pr-10 focus:ring-2 focus:ring-purple-400 outline-none"
            />
            {form.password && (
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            )}
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full p-3 border rounded-md pr-10 focus:ring-2 focus:ring-purple-400 outline-none"
            />
            {form.confirmPassword && (
              <span
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>
            )}
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded-md font-semibold"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            href="/"
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>

      {/* RIGHT SIDE - GRADIENT SECTION */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 items-center justify-center text-white p-12">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-6">
            Welcome!
          </h1>
          <p className="text-lg opacity-90">
            Join our platform and start managing your dashboard
            with powerful tools and a clean UI experience.
          </p>
        </div>
      </div>

    </div>
  </div>
);
}