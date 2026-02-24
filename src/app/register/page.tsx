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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        {message && (
          <div
            className={`p-3 text-center rounded-md ${
              success
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full p-3 border rounded-md"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
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
            className="w-full p-3 border rounded-md"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
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
            className="w-full p-3 border rounded-md pr-10"
          />
          {errors.password && (
  <p className="text-red-500 text-sm mt-1">
    {errors.password}
  </p>
)}
          {form.password && (
  <span
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
)}
        </div>

       

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            className="w-full p-3 border rounded-md pr-10"
          />
         {form.confirmPassword && (
  <span
    onClick={() =>
      setShowConfirmPassword(!showConfirmPassword)
    }
    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
  >
    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md"
        >
          Register
        </button>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}