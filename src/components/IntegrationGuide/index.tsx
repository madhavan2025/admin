export default function IntegrationGuide() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">

      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Chatbot Integration Guide</h1>
        <p className="text-sm text-gray-500">
          Follow the steps below to add the chatbot to your website. No coding experience required.
        </p>
      </div>

      {/* STEP 1 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="bg-primary text-white text-xs px-2 py-1 rounded">1</span>
          Copy the Script
        </h2>

        <p className="text-sm text-gray-600">
          Copy the script below. This script loads the chatbot on your website.
        </p>

        <div className="bg-black text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`<script src="https://chatorder.vercel.app/chatbot.js"></script>`}
        </div>
      </div>

      {/* STEP 2 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="bg-primary text-white text-xs px-2 py-1 rounded">2</span>
          Add the Script to Your Website
        </h2>

        <p className="text-sm text-gray-600">
          Paste the script just before the closing <code>&lt;/body&gt;</code> tag of your website.
        </p>
      </div>

      {/* HTML */}
      <div className="space-y-3">
        <h3 className="font-semibold text-md">HTML Websites</h3>

        <div className="bg-gray-50 p-4 rounded-lg">
          <ol className="list-decimal pl-5 text-sm space-y-2 text-gray-700">
            <li>Open your HTML file (e.g., <code>index.html</code>)</li>
            <li>Scroll to the bottom of the file</li>
            <li>Locate the closing <code>&lt;/body&gt;</code> tag</li>
            <li>Paste the chatbot script just above it</li>
            <li>Save the file and refresh your website</li>
          </ol>
        </div>
      </div>

      {/* WORDPRESS */}
      <div className="space-y-5">
        <h3 className="font-semibold text-md">WordPress Websites</h3>

        {/* METHOD 1 */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <p className="font-semibold text-sm">Method 1 (Recommended - Safe)</p>

          <ol className="list-decimal pl-5 text-sm space-y-2">
            <li>Go to Plugins → Add New</li>
            <li>Search for <b>"Code Snippets"</b></li>
            <li>Install and activate the plugin</li>
            <li>Go to Snippets → Add New</li>
            <li>Paste the chatbot script</li>
            <li>Select <b>Run snippet in footer</b></li>
            <li>Save and activate</li>
          </ol>
        </div>

        {/* METHOD 2 */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <p className="font-semibold text-sm">Method 2 (Advanced - Use Carefully)</p>

          <ol className="list-decimal pl-5 text-sm space-y-2">
            <li>Go to Appearance → Theme File Editor</li>
            <li>Open <code>footer.php</code></li>
            <li>Paste the script before <code>&lt;/body&gt;</code></li>
            <li>Click Update File</li>
          </ol>

          <p className="text-xs text-red-500">
            ⚠️ Warning: Editing theme files incorrectly may break your website. Always backup before making changes.
          </p>
        </div>

        {/* METHOD 3 */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <p className="font-semibold text-sm">Method 3 (Using Theme / Plugin Settings)</p>

          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>Go to Appearance → Customize (or Theme Settings)</li>
            <li>Find options like:
              <ul className="list-disc pl-5 mt-1">
                <li>Custom JS</li>
                <li>Header/Footer Scripts</li>
                <li>Additional Code</li>
              </ul>
            </li>
            <li>Paste the chatbot script in the <b>Footer / Body section</b></li>
            <li>Save or Publish changes</li>
          </ol>

          <p className="text-xs text-gray-500">
            Tip: Plugins like "Insert Headers and Footers" also make this easy.
          </p>
        </div>
      </div>

      {/* REACT */}
      <div className="space-y-4">
        <h3 className="font-semibold text-md">React / Next.js</h3>

        <p className="text-sm text-gray-600">
          Use the Next.js Script component to properly load the chatbot:
        </p>

        <pre className="bg-black text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`import Script from "next/script";

export default function Layout() {
  return (
    <>
      <Script 
        src="https://chatorder.vercel.app/chatbot.js"
        strategy="afterInteractive"
      />
    </>
  );
}`}
        </pre>

        <ol className="list-decimal pl-5 text-sm space-y-2 text-gray-700">
          <li>Open <code>layout.tsx</code> or <code>_app.tsx</code></li>
          <li>Add the Script component</li>
          <li>Save and refresh your app</li>
        </ol>
      </div>

      {/* FINAL */}
      <div className="bg-green-50 border border-green-200 p-5 rounded-lg space-y-1">
        <p className="font-semibold text-green-700">✅ Integration Complete</p>
        <p className="text-sm text-green-600">
          The chatbot should now appear automatically on your website.
        </p>
      </div>

    </div>
  );
}