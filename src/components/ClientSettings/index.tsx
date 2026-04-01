"use client";

import React, { useEffect, useState } from "react";
import { Alert } from "@/components/ui-elements/alert";
import { useRouter } from "next/navigation";
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
  const [showInstructions, setShowInstructions] = useState(false);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
const router = useRouter();
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
      setShowInstructions(true);
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
    setShowInstructions(true);
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
    ? "Save"
    : "Create"}
</button>

      <hr className="border-stroke dark:border-dark-3" />
      {/* Instructions Section */}
{showInstructions && (
  <div className="rounded-xl border border-stroke p-5 dark:border-dark-3 bg-gray-50 dark:bg-dark-2 space-y-4">

   <h3 className="text-lg font-bold text-dark dark:text-white">Digital Assistant Integration</h3>

    {/* Script */}
    <div>
      <p className="text-sm  text-dark dark:text-white mb-2">Step 1: Add Digital Assistant Script</p>
      <div className="bg-black text-green-400 p-3 rounded-lg text-sm overflow-x-auto">
        {`<script src="https://chatorder.vercel.app/chatbot.js"></script>`}
      </div>
    </div>

    {/* Short Instructions */}
    <div>
      <p className="text-sm  text-dark dark:text-white mb-2">Step 2: How to Use</p>
      <ul className="list-disc pl-5 text-sm space-y-1">
        <li>Add this script before closing <code>{`</body>`}</code> tag</li>
        <li>Works automatically after adding</li>
        
      </ul>
    </div>

    {/* View More Toggle */}
   <button
  onClick={() => router.push("/integration-guide")}
  className="text-primary text-sm font-semibold underline"
>
  View More
</button>

    
  </div>
)}

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