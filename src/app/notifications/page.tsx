"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// 1. Define the interface so TypeScript knows the properties exist
interface NotificationItem {
  _id: string;
  userId: string;
  title: string;
  message: string;
  status: "unseen" | "seen";
  role: string;
  createdAt: string;
}

export default function NotificationsPage() {
  // 2. Apply the interface to the state
  const [data, setData] = useState<NotificationItem[]>([]);
   const [userId, setUserId] = useState<string | null>(null);

useEffect(() => {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  setUserId(user?.id || null);
}, []);

  useEffect(() => {
  if (!userId) return;

  fetch(`/api/notifications?userId=${userId}`)
    .then((res) => res.json()) 
    .then((json) => setData(Array.isArray(json) ? json : []))
    .catch((err) =>
      console.error("Error fetching notifications:", err)
    );
}, [userId]);

useEffect(() => {
  if (!userId) return;

  // Mark all as seen
  fetch("/api/notifications", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  }).catch((err) =>
    console.error("Failed to update notifications:", err)
  );
}, [userId]);

  return (
    <div className="px-2 py-4 sm:px-4 md:px-6">
      <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <div className="px-6 py-4 border-b border-stroke dark:border-dark-3">
          <h4 className="text-xl font-bold text-dark dark:text-white">
            Recent Activity
          </h4>
        </div>

        <div className="hidden md:block max-w-full overflow-x-auto">
  {/* Desktop Table */}
  <table className="w-full table-auto">
    <thead>
      <tr className="bg-gray-100 text-left">
        <th className="px-4 py-3 font-medium">User ID</th>
        <th className="px-4 py-3 font-medium">Notification</th>
        <th className="px-4 py-3 font-medium">Time</th>
        <th className="px-4 py-3 font-medium">Status</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item) => (
        <tr key={item._id} className="border-b">
          <td className="px-4 py-4 text-sm">{item.userId}</td>

          <td className="px-4 py-4">
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-gray-500 break-words">
              {item.message}
            </p>
          </td>

          <td className="px-4 py-4 text-sm whitespace-nowrap">
            {new Date(item.createdAt).toLocaleString()}
          </td>

          <td className="px-4 py-4">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                item.status === "unseen"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {item.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* Mobile Card Layout */}
<div className="md:hidden space-y-4">
  {data.map((item) => (
    <div
      key={item._id}
      className="border rounded-lg p-4 shadow-sm bg-white"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-500">
          User: {item.userId}
        </span>
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            item.status === "unseen"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {item.status}
        </span>
      </div>

      <p className="font-semibold">{item.title}</p>
      <p className="text-sm text-gray-500 break-words">
        {item.message}
      </p>

      <p className="text-xs text-gray-400 mt-2">
        {new Date(item.createdAt).toLocaleString()}
      </p>
    </div>
  ))}

  {data.length === 0 && (
    <p className="text-center text-gray-500 py-6">
      No notifications found.
    </p>
  )}
</div>
      </div>
    </div>
  );
}