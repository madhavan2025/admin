"use client";

import React, { useState, useEffect } from "react";
import { Alert } from "@/components/ui-elements/alert"; 
import { cn } from "@/lib/utils";

const agentFonts = ["Arial", "Courier New", "Roboto", "Poppins"];

export default function AgentSettings() {
  const [agentName, setAgentName] = useState("");
  const [agentIcon, setAgentIcon] = useState("");
  const [agentFont, setAgentFont] = useState("");
  const [enableShopping, setEnableShopping] = useState(false);
  const [theme, setTheme] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false); // new state
  // Get user from localStorage
const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : null;
const userId = user?.id;

  // Fetch agent settings
useEffect(() => {
  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/agent", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error("Failed to fetch agent settings");
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Defensive fallback
      setAgentName(data?.agentName || "");
      setAgentIcon(data?.agentIcon || "");
      setAgentFont(data?.agentFont || agentFonts[0]);
      setEnableShopping(data?.enableShopping || false);
      setTheme(data?.theme || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchSettings();
}, [userId]);

  // Save agent settings
  const handleSave = async () => {
    setSaving(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
  console.error("No token found in localStorage");
  return;
}
    const payload = { agentName, agentIcon, agentFont, enableShopping, theme };

    const response = await fetch("/api/agent", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to save settings");

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  } catch (error) {
    console.error("Error saving agent:", error);
  }finally {
    setSaving(false); // stop loading
  }
};

  if (loading) return <div className="p-6 text-center">Loading settings...</div>;

  return (
    <div className="max-w-2xl space-y-8 p-4">
      {/* Agent Name */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-dark dark:text-white">Agent Name</label>
        <input
          type="text"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
      </div>

      {/* Agent Icon */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-dark dark:text-white">Agent Icon</label>
        <div className="flex items-center gap-4">
          <input
  type="text"
  value={agentIcon}
  onChange={(e) => setAgentIcon(e.target.value)}
  placeholder="Icon URL"
  className="w-full sm:w-auto sm:flex-1 rounded-lg border border-stroke bg-transparent px-4 py-2.5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
/>
         <div className="h-12 w-12 flex-shrink-0">
  {agentIcon ? (
    <img
      src={agentIcon}
      alt="Preview"
      className="h-full w-full  object-cover"
    />
  ) : (
    <div className="h-full w-full rounded-full bg-gray-200 dark:bg-dark-2" />
  )}
</div>
        </div>
      </div>

      {/* Font & Shopping */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-dark dark:text-white">Agent Font</label>
        <select
          value={agentFont}
          onChange={(e) => setAgentFont(e.target.value)}
          className="rounded-lg border border-stroke bg-transparent px-4 py-2.5 outline-none dark:border-dark-3 dark:bg-dark-2"
        >
          {agentFonts.map((font) => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3/10">
        <label className="flex cursor-pointer items-center justify-between">
          <span className="font-semibold text-dark dark:text-white">Enable Shopping Features</span>
          <input
            type="checkbox"
            checked={enableShopping}
            onChange={(e) => setEnableShopping(e.target.checked)}
            className="h-6 w-6 rounded border-stroke accent-primary cursor-pointer"
          />
        </label>
        <p className="mt-1 text-xs text-gray-500">Allow the agent to process product searches and checkout links.</p>
      </div>

      <hr className="border-stroke dark:border-dark-3" />

      {/* Theme Editor */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-dark dark:text-white">Theme Customization</h3>
        <div className="grid gap-3">
          {Object.keys(theme).map((key) => {
            const isColor = key.toLowerCase().includes("bg") || key.toLowerCase().includes("color");
            return (
              <div key={key} className="flex items-center justify-between rounded-lg border border-stroke bg-gray-50 p-3 dark:border-dark-3 dark:bg-dark-3/20">
                <span className="text-sm font-medium capitalize text-dark dark:text-gray-400">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type={isColor ? "color" : "text"}
                    value={theme[key as keyof typeof theme]}
                    onChange={(e) => setTheme({ ...theme, [key]: e.target.value })}
                    className={cn(
                      "rounded border border-stroke outline-none transition-all",
                      isColor ? "h-8 w-12 p-0.5 cursor-pointer" : "h-8 w-24 px-2 text-xs"
                    )}
                  />
                  {!isColor && <span className="text-[10px] text-gray-400">px/css</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
  onClick={handleSave}
  disabled={saving} // disable while saving
  className={`mt-4 w-full rounded-lg bg-primary py-4 font-bold text-white transition hover:bg-opacity-90 shadow-lg ${
    saving ? "opacity-70 cursor-not-allowed" : ""
  }`}
>
  {saving ? "Saving..." : "Save Configuration"}
</button>

      {saved && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <Alert variant="success" title="Settings Saved" description="Agent live settings updated." />
        </div>
      )}
    </div>
  );
}