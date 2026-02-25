"use client";

import { useEffect, useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

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

  useEffect(() => {
    // Get user info from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setForm(prev => ({
        ...prev,
        fullName: parsedUser.name || "",
        email: parsedUser.email || "",
      }));
      setUserId(parsedUser.id || ""); // assuming your token/user has `id`
    }

    // Fetch editable profile info from API
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      console.log("User not found.");
      return;
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
         userId,
        fullName: form.fullName,   // ✅ ADD THIS
        email: form.email,         // ✅ ADD THIS
        phoneNumber: form.phoneNumber,
        username: form.username,
        bio: form.bio,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Profile saved successfully!");
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <ShowcaseSection title="Personal Information" className="!p-7">
      <form onSubmit={handleSubmit}>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
  className="w-full sm:w-1/2"
  type="text"
  name="fullName"
  label="Full Name"
  placeholder="Full Name"
  value={form.fullName}
  onChange={handleChange}
/>


          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="phoneNumber"
            label="Phone Number"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
          />
        </div>

       <InputGroup
  className="mb-5.5"
  type="email"
  name="email"
  label="Email Address"
  placeholder="Email Address"
  value={form.email}
  onChange={handleChange}
/>

        <InputGroup
          className="mb-5.5"
          type="text"
          name="username"
          label="Username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

        <TextAreaGroup
          className="mb-5.5"
          label="BIO"
          placeholder="Tell us about yourself"
          name="bio"
          value={form.bio}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
          >
            Save
          </button>
        </div>
      </form>
    </ShowcaseSection>
  );
}