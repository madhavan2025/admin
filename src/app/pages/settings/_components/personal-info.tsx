"use client";

import { useEffect, useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Alert } from "@/components/ui-elements/alert";

interface FormState {
  fullName: string;
  email: string;
  phoneNumber: string;
  username: string;
  bio: string;
}

export function PersonalInfoForm() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phoneNumber: "",
    username: "",
    bio: "",
  });

  const [userId, setUserId] = useState<string>("");

  // ✅ NEW STATES
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setForm(prev => ({
        ...prev,
        fullName: parsedUser.name || "",
        email: parsedUser.email || "",
      }));
      setUserId(parsedUser.id || "");
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      const res = await fetch(`/api/profile?userId=${userId}`);
      const data = await res.json();

      if (res.ok) {
        setForm(prev => ({
          ...prev,
          phoneNumber: data.phoneNumber || "",
          username: data.username || "",
          bio: data.bio || "",
        }));
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name as keyof FormState]: value }));

    // ✅ Clear error while typing
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // ✅ VALIDATION FUNCTION
  const validate = () => {
    const newErrors: Partial<FormState> = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (form.phoneNumber && !/^[0-9]{10}$/.test(form.phoneNumber)) {
      newErrors.phoneNumber = "Phone must be 10 digits";
    }

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!userId) {
      console.log("User not found.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          username: form.username,
          bio: form.bio,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ShowcaseSection title="Personal Information" className="!p-7">
      <form onSubmit={handleSubmit}>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <InputGroup
              type="text"
              name="fullName"
              label="Full Name"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          <div className="w-full sm:w-1/2">
            <InputGroup
              type="text"
              name="phoneNumber"
              label="Phone Number"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </div>
        </div>

        <div className="mb-5.5">
          <InputGroup
            type="email"
            name="email"
            label="Email Address"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="mb-5.5">
          <InputGroup
            type="text"
            name="username"
            label="Username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

        <TextAreaGroup
          className="mb-5.5"
          label="BIO"
          placeholder="Tell us about yourself"
          name="bio"
          value={form.bio}
          onChange={handleChange}
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className={`rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90 ${
              saving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      {/* ✅ SUCCESS ALERT */}
      {saved && (
       <div
    className="
      fixed z-50 animate-bounce
      inset-0 flex items-center justify-center   // centers on all sides
      sm:bottom-5 sm:right-5 sm:inset-auto sm:flex-none  // moves to bottom-right on larger screens
    "
  >
    <div className="w-full max-w-sm">  
          <Alert
            variant="success"
            title="Profile Saved"
            description="Your profile has been updated successfully."
          />
          </div>
        </div>
      )}
    </ShowcaseSection>
  );
}