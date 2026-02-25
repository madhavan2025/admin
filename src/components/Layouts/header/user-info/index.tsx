"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import { useRouter } from "next/navigation";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
   const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

 useEffect(() => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // 👇 fetch avatar from DB
      if (parsedUser.id) {
        fetchAvatar(parsedUser.id);
      }
    }
  } catch (error) {
    console.error("Invalid user in localStorage");
    localStorage.removeItem("user");
  }
}, []);

  const fetchAvatar = async (userId: string) => {
    try {
      const res = await fetch(`/api/get-avatar?userId=${userId}`);
      if (!res.ok) throw new Error("Avatar not found");
      const data = await res.json();
      setAvatarUrl(data.avatar_url || null);
    } catch (error) {
      console.warn("Avatar fetch failed, using default icon");
      setAvatarUrl(null); // fallback to Google-like icon
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsOpen(false);
    router.push("/login"); // better than reload
  };

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          {/* Avatar Circle */}
           {avatarUrl ? (
            <Image
              src={avatarUrl}
              className="size-12 rounded-full object-cover"
              alt={`Avatar for ${user?.name}`}
              width={48}
              height={48}
            />
          ) : (
            <div className="flex items-center justify-center size-12 rounded-full bg-gray-200  font-semibold text-lg">
              {firstLetter}
            </div>
          )}

          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{user?.name || "Guest"}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0"
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
         {avatarUrl ? (
  <Image
    src={avatarUrl}
    className="size-12 rounded-full object-cover"
    alt={`Avatar for ${user?.name}`}
    width={48}
    height={48}
  />
) : (
  <div className="flex items-center justify-center size-12 rounded-full bg-gray-200 font-semibold">
    {firstLetter}
  </div>
)}

          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {user?.name || "Guest"}
            </div>

            <div className="leading-none text-gray-6">
              {user?.email || "No email"}
            </div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />
            <span className="mr-auto font-medium">View profile</span>
          </Link>

          <Link
            href="/pages/settings"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />
            <span className="mr-auto font-medium">
              Account Settings
            </span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={handleLogout}
          >
            <LogOutIcon />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}