"use client";

import { UploadIcon } from "@/assets/icons";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import Image from "next/image";
import { useEffect, useState } from "react";

export function UploadPhotoForm() {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  // ✅ Get userId and username from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserId(parsed.id);
      setUsername(parsed.name); // assuming "name" is stored
    }
  }, []);

  // ✅ UPLOAD / EDIT IMAGE
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    const res = await fetch("/api/upload-avatar", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setAvatarUrl(data.imageUrl);
    } else {
      alert("Upload failed");
    }
  };

  // ✅ DELETE IMAGE
  const handleDelete = async () => {
    if (!userId || !avatarUrl) return;

    const res = await fetch("/api/upload-avatar", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, avatarUrl }),
    });

    if (res.ok) {
      setAvatarUrl("");
    } else {
      alert("Delete failed");
    }
  };

  return (
    <ShowcaseSection title={avatarUrl ? "Your Photo" : "Upload your photo"} className="!p-7">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4 flex items-center gap-3">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              width={55}
              height={55}
              alt="User"
              className="size-14 rounded-full object-cover"
            />
          ) : (
            <div className="size-14 flex items-center justify-center rounded-full bg-gray-200 text-xl font-semibold">
              {username ? username.charAt(0).toUpperCase() : "👤"}
            </div>
          )}

          <div>
            {avatarUrl && (
              <>
                <span className="mb-1.5 font-medium text-dark dark:text-white">
                  Edit your photo
                </span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="text-body-sm hover:text-red"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative mb-5.5 block w-full rounded-xl border border-dashed border-gray-4 bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary">
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            onChange={handleFileChange}
            className="hidden"
            id="profilePhoto"
          />

          <label
            htmlFor="profilePhoto"
            className="flex cursor-pointer flex-col items-center justify-center p-4 sm:py-7.5"
          >
            <div className="flex size-13.5 items-center justify-center rounded-full border bg-white">
              <UploadIcon />
            </div>

            <p className="mt-2.5 text-body-sm font-medium">
              <span className="text-primary">
                {avatarUrl ? "Change photo" : "Click to upload"}
              </span>
            </p>

            <p className="mt-1 text-body-xs">
              PNG, JPG (max 800x800px)
            </p>
          </label>
        </div>
      </form>
    </ShowcaseSection>
  );
}