"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/20/solid";

export default function IntegrationGuide() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]); // fixed type
  const router = useRouter();
  const [email, setEmail] = useState("");
const [sending, setSending] = useState(false);
const [sent, setSent] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
const [copied, setCopied] = useState(false);

const scriptCode = `<script src="https://chatorder.vercel.app/chatbot.js?id=client-d"></script>`;

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error("Copy failed", err);
  }
};

  useEffect(() => {
    const user =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "{}")
        : null;

    setUserId(user?.id || null);
  }, []);

  const fetchClients = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/client?userId=${userId}`);
      const data = await res.json();

      if (data?.data) {
        setClients([data.data]); // keep array format
      } else {
        setClients([]);
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchClients();
    }
  }, [userId]);

  if (loading) {
    return <div className="p-6 text-center">Checking...</div>;
  }

  // ✅ Correct condition
if (clients.length === 0) {
  return (
    <div className="p-6 text-center text-gray-600">
      No client found. Please{" "}
      <span
        className="text-primary underline cursor-pointer"
        onClick={() => router.push("/client-settings")}
      >
        create a client
      </span>{" "}
      first.
    </div>
  );
}

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <div className=" rounded-lg space-y-3">
  <h3 className="font-bold text-dark dark:text-white text-lg">Send Instructions via Email:</h3>

  <input
    type="email"
    placeholder="Enter email address"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full border px-3 py-2 rounded-lg text-sm"
  />

  <button
    onClick={async () => {
      if (!email) return alert("Enter email");

      setSending(true);
      try {
        await fetch("/api/send-instructions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        setSent(true);
        setEmail("");
        setTimeout(() => setSent(false), 3000);
      } catch (err) {
        console.error(err);
      } finally {
        setSending(false);
      }
    }}
    className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
    disabled={sending}
  >
    {sending ? "Sending..." : "Send Email"}
  </button>

  {sent && (
    <p className="text-green-600 text-sm">
      Instructions sent successfully!
    </p>
  )}
</div>
      {/* HEADER */}
      <div className="space-y-2">
       <h1 className="text-xl font-bold text-dark dark:text-white">Digital Assistant Integration Guide</h1>
        <p className="text-sm text-body-color">
          Follow the steps below to add the Digital Assistant to your website. No coding experience required.
        </p>
      </div>

      {/* STEP 1 */}
   <div className="space-y-4">
  <h2 className="text-lg font-bold text-dark dark:text-white flex items-center gap-2">
    <span className="bg-primary text-white text-xs px-2 py-1 rounded">1</span>
    Copy the Script
  </h2>

  <p className="text-sm text-body-color">
    Copy the script below. This script loads the Digital Assistant on your website.
  </p>

  <div className="bg-black text-green-400 p-4 rounded-lg text-sm overflow-x-auto relative group">
  
  <pre>{scriptCode}</pre>

  <button
    onClick={handleCopy}
    className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded text-xs flex items-center gap-1 cursor-pointer hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition"
  >
    {copied ? (
      <>
        <CheckIcon className="w-4 h-4" /> Copied
      </>
    ) : (
      <>
        <ClipboardDocumentIcon className="w-4 h-4" /> Copy
      </>
    )}
  </button>

</div>
</div>

      {/* STEP 2 */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-dark dark:text-white flex items-center gap-2">
          <span className="bg-primary text-white text-xs px-2 py-1 rounded">2</span>
          Add the Script to Your Website
        </h2>

        <p className="text-sm text-body-color">
          Paste the script just before the closing <code>&lt;/body&gt;</code> tag of your website.
        </p>
      </div>

      {/* HTML */}
      <div className="space-y-3">
        <h3 className="font-bold text-dark dark:text-white text-md">HTML Websites</h3>

        <div className=" p-4 rounded-lg">
          <ol className="list-decimal pl-5 text-sm space-y-2 text-body-color">
            <li>Open your HTML file (e.g., <code>index.html</code>)</li>
            <li>Scroll to the bottom of the file</li>
            <li>Locate the closing <code>&lt;/body&gt;</code> tag</li>
            <li>Paste the Digital Assistant script just above it</li>
            <li>Save the file and refresh your website</li>
          </ol>
        </div>
      </div>

      {/* WORDPRESS */}
      <div className="space-y-5">
        <h3 className="font-bold text-dark dark:text-white text-md">WordPress Websites</h3>

        {/* METHOD 1 */}
        <div className=" p-4 rounded-lg space-y-2">
          <p className="font-bold text-dark dark:text-white text-sm">Method 1 (Recommended - Safe)</p>

          <ol className="list-decimal pl-5 text-sm space-y-2">
            <li>Go to Plugins → Add New</li>
           <li>Search for <b>&quot;Code Snippets&quot;</b></li>
            <li>Install and activate the plugin</li>
            <li>Go to Snippets → Add New</li>
            <li>Paste the Digital Assistant script</li>
            <li>Select <b>Run snippet in footer</b></li>
            <li>Save and activate</li>
          </ol>
        </div>

        {/* METHOD 2 */}
        <div className=" p-4 rounded-lg space-y-2">
          <p className="font-bold text-dark dark:text-white text-sm">Method 2 (Advanced - Use Carefully)</p>

          <ol className="list-decimal pl-5 text-sm space-y-2">
            <li>Go to Appearance → Theme File Editor</li>
            <li>Open <code>footer.php</code></li>
            <li>Paste the script before <code>&lt;/body&gt;</code></li>
            <li>Click Update File</li>
          </ol>

          <p className="text-xs text-red-500 font-bold">
            ⚠️ Warning: Editing theme files incorrectly may break your website. Always backup before making changes.
          </p>
        </div>

        {/* METHOD 3 */}
        <div className=" p-4 rounded-lg space-y-2">
          <p className="font-bold text-dark dark:text-white text-sm">Method 3 (Using Theme / Plugin Settings)</p>

          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>Go to Appearance → Customize (or Theme Settings)</li>
            <li>Find options like:
              <ul className="list-disc pl-5 mt-1">
                <li>Custom JS</li>
                <li>Header/Footer Scripts</li>
                <li>Additional Code</li>
              </ul>
            </li>
            <li>Paste the Digital Assistant script in the <b>Footer / Body section</b></li>
            <li>Save or Publish changes</li>
          </ol>

          <p className="text-xs text-sm text-body-color">
           Tip: Plugins like &quot;Insert Headers and Footers&quot; also make this easy.
          </p>
        </div>
      </div>

      {/* REACT */}
      <div className="space-y-4">
        <h3 className="font-bold text-dark dark:text-white text-md">React / Next.js</h3>

        <p className="text-sm text-body-color">
          Use the Next.js Script component to properly load the Digital Assistant:
        </p>

        <pre className="bg-black text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`import Script from "next/script";

export default function Layout() {
  return (
    <>
      <Script 
        src="https://chatorder.vercel.app/chatbot.js?id=client-d"
        strategy="afterInteractive"
      />
    </>
  );
}`}
        </pre>

        <ol className="list-decimal pl-5 text-sm space-y-2  text-body-color">
          <li>Open <code>layout.tsx</code> or <code>_app.tsx</code></li>
          <li>Add the Script component</li>
          <li>Save and refresh your app</li>
        </ol>
      </div>

      {/* FINAL */}
      <div className="p-5 rounded-lg space-y-1">
        <p className="font-semibold text-green-700">✅ Integration Complete</p>
        <p className="text-sm text-green-600">
          The Digital Assistant should now appear automatically on your website.
        </p>
      </div>

    </div>
  );
}