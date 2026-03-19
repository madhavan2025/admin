"use client";

import React, { useEffect, useState } from "react";
import { Alert } from "@/components/ui-elements/alert";

type Client = {
  clientId: string;
  clientName: string;
  clientUrl: string;
};

export default function ClientSettings() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientUrl, setClientUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);

useEffect(() => {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  setUserId(user?.id || null);
}, []);

  const fetchClients = async () => {
  if (!userId) return;

  try {
    const res = await fetch(`/api/client?userId=${userId}`);
    const data = await res.json();

    if (data.data) {
      setClients([data.data]); // store as array for reuse
      setEditingId(data.data.clientId);

      // Pre-fill form
      setClientName(data.data.clientName);
      setClientUrl(data.data.clientUrl);
    } else {
      setClients([]);
    }
  } catch (err) {
    console.error("Error fetching clients:", err);
  } finally {
    setLoading(false);
  }
};

 useEffect(() => {
  if (userId) {
    fetchClients();
  }
}, [userId]);
  // Save / Update
const handleSave = async () => {
    setSaving(true);
  try {
    const payload: any = {
  clientName,
  clientUrl,
  userId,
};

if (editingId) {
  payload.clientId = editingId; // only include when updating
}
 const method = editingId ? "PUT" : "POST";

    await fetch("/api/client", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    await fetchClients();

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  } catch (err) {
    console.error("Error saving client:", err);
  }finally {
    setSaving(false); // stop button loading
  }
};
  

  if (loading) {
    return <div className="p-6 text-center">Loading clients...</div>;
  }

  return (
    <div className="max-w-2xl space-y-8 p-4">
      {/* Title */}
      <h2 className="text-xl font-bold text-dark dark:text-white">
        Client Settings
      </h2>

      {/* Client Name */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-dark dark:text-white">
          Client Name
        </label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
      </div>

      {/* Client URL */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-dark dark:text-white">
          Client URL
        </label>
        <input
          type="text"
          value={clientUrl}
          onChange={(e) => setClientUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
      </div>

      {/* Save Button */}
      <button
  onClick={handleSave}
  disabled={saving} // disable while saving
  className={`w-full rounded-lg bg-primary py-4 font-bold text-white transition hover:bg-opacity-90 shadow-lg ${
    saving ? "opacity-70 cursor-not-allowed" : ""
  }`}
>
  {saving
    ? "Saving..."
    : clients.length > 0
    ? "Update Client"
    : "Create Client"}
</button>

      <hr className="border-stroke dark:border-dark-3" />


      {/* Toast */}
      {saved && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <Alert
            variant="success"
            title="Saved"
            description="Client settings updated successfully."
          />
        </div>
      )}
    </div>
  );
}