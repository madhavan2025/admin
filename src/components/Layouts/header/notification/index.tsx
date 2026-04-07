"use client";

import { useEffect, useState } from "react";
import { Dropdown, DropdownContent, DropdownTrigger } from "@/components/ui/dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import Link from "next/link";
import { BellIcon } from "./icons";

// 1. Define the Interface
interface NotificationItem {
  _id: string;
  userId: string;
  title: string;
  message: string;
  status: "unseen" | "seen";
  role: string;
  createdAt: string;
}

export function Notification() {
  // 2. Single declaration with correct Typing
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const isMobile = useIsMobile();

 

// ✅ Get userId from localStorage
useEffect(() => {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  setUserId(user?.id || null);
}, []);

// ✅ Fetch Notifications (with userId)
const fetchNotifications = async () => {
  if (!userId) return;

  try {
    const res = await fetch(`/api/notifications?userId=${userId}`);
    const data = await res.json();

    setNotifications(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
  }
};

// ✅ Fetch when userId ready
useEffect(() => {
  if (userId) {
    fetchNotifications();
  }
}, [userId]);

// ✅ Refetch when dropdown opens (real feel)
useEffect(() => {
  if (isOpen) {
    fetchNotifications();
  }
}, [isOpen]);

 const unreadCount = notifications.filter(
  (n) => n.status === "unseen"
).length;
  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
     <DropdownTrigger
        className="grid size-12 place-items-center rounded-full border bg-gray-2 text-dark outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus-visible:border-primary"
        aria-label="View Notifications"
      >
        <span className="relative">
          <BellIcon />
          {unreadCount > 0 && (
            <span className="absolute right-0 top-0 size-2 rounded-full bg-red-light ring-2 ring-gray-2 animate-pulse" />
          )}
        </span>
      </DropdownTrigger>

      <DropdownContent 
  align={isMobile ? "end" : "center"} 
  className="min-w-[18rem] p-3 bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 shadow-lg rounded-xl"
>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium">Notifications</span>
          <span className="rounded bg-primary px-2 py-0.5 text-xs text-white">
            {unreadCount} New
          </span>
        </div>

        <ul className="mb-3 max-h-[300px] overflow-y-auto space-y-1">
          {notifications
  .filter((n) => n.status === "unseen")
  .slice(0, 5)
  .map((item) => (
          <li key={item._id}>
  <Link
    href="/notifications"
    onClick={() => setIsOpen(false)}
    className={`
      flex flex-col gap-1 p-3 rounded-xl
      transition-all duration-200
      ${item.status === "unseen"
        ? "bg-gray-1 dark:bg-dark-3"
        : "bg-transparent"}
      hover:bg-gray-2 dark:hover:bg-dark-4
    `}
  >
    {/* Title */}
    <p className="text-sm font-semibold text-dark dark:text-white">
      {item.title}
    </p>

    {/* Message */}
    <p className="text-xs text-gray-500">
      {item.message}
    </p>

    {/* Footer */}
    <div className="flex items-center justify-between mt-1">
      <span className="text-[10px] text-gray-400">
        {new Date(item.createdAt).toLocaleString()}
      </span>

      {item.status === "unseen" && (
        <span className="h-2 w-2 rounded-full bg-primary" />
      )}
    </div>
  </Link>
</li>
          ))}
          {notifications.length === 0 && (
            <li className="py-4 text-center text-xs text-gray-400">No notifications</li>
          )}
        </ul>

        <Link
          href="/notifications"
          onClick={() => setIsOpen(false)}
          className="block w-full text-center py-2 text-sm font-medium border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition"
        >
          See all notifications
        </Link>
      </DropdownContent>
    </Dropdown>
  );
}





