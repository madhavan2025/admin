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
    <div className="p-6">
      <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <div className="px-6 py-4 border-b border-stroke dark:border-dark-3">
          <h4 className="text-xl font-bold text-dark dark:text-white">
            Recent Activity
          </h4>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
  <tr className="bg-gray-2 text-left dark:bg-dark-2">
    <th className="px-4 py-4 font-medium">User ID</th>
    <th className="px-4 py-4 font-medium">Notification</th>
    <th className="px-4 py-4 font-medium">Time</th>
    <th className="px-4 py-4 font-medium">Status</th>
  </tr>
</thead>
            <tbody>
  {data.map((item) => (
    <tr
      key={item._id}
      className="border-b border-stroke dark:border-dark-3"
    >
      {/* UserId */}
      <td className="px-4 py-5 text-sm font-medium">
        {item.userId}
      </td>

      {/* Message */}
      <td className="px-4 py-5">
        <p className="text-sm font-bold text-dark dark:text-white">
          {item.title}
        </p>
        <p className="text-xs text-gray-500">
          {item.message}
        </p>
      </td>

      {/* Time */}
      <td className="px-4 py-5 text-sm">
        {item.createdAt
          ? new Date(item.createdAt).toLocaleString()
          : "N/A"}
      </td>

      {/* Status */}
      <td className="px-4 py-5">
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

  {data.length === 0 && (
    <tr>
      <td colSpan={4} className="py-10 text-center text-gray-500">
        No activity found.
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}