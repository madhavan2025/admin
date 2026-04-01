import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

  const htmlContent = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

  <h2 style="color:#4f46e5;">Digital Assistant Integration Guide</h2>
  <p>Follow the steps below to add the Digital Assistant to your website. No coding experience required.</p>

  <hr />

  <h3>1. Copy the Script</h3>
  <p>Copy the script below. This script loads the Digital Assistant on your website.</p>

  <div style="background:#000; color:#00ff00; padding:10px; border-radius:6px; font-size:13px; white-space:pre-line;">
&lt;script&gt;
  window.chatorder = window.chatorder || function() {
    (window.chatorder.q = window.chatorder.q || []).push(arguments);
  };

  chatorder('init', {
    botId: 'client-d',
    theme: 'dark'
  });

  (function(d,s){
    var js = d.createElement(s);
    js.src = "https://chatorder.vercel.app/chatbot.js";
    js.async = true;
    d.head.appendChild(js);
  })(document, "script");
&lt;/script&gt;
</div>

  <h3>2. Add the Script to Your Website</h3>
  <p>Paste the script just before the closing &lt;/body&gt; tag of your website.</p>

  <hr />

  <h3>HTML Websites</h3>
  <ol>
    <li>Open your HTML file (e.g., index.html)</li>
    <li>Scroll to the bottom</li>
    <li>Locate the closing &lt;/body&gt; tag</li>
    <li>Paste the script just above it</li>
    <li>Save and refresh your website</li>
  </ol>

  <hr />

  <h3>WordPress Websites</h3>

  <p><strong>Method 1 (Recommended - Safe)</strong></p>
  <ol>
    <li>Go to Plugins → Add New</li>
    <li>Search for "Code Snippets"</li>
    <li>Install and activate</li>
    <li>Go to Snippets → Add New</li>
    <li>Paste the Digital Assistant script</li>
    <li>Select "Run snippet in footer"</li>
    <li>Save and activate</li>
  </ol>

  <p><strong>Method 2 (Advanced)</strong></p>
  <ol>
    <li>Go to Appearance → Theme File Editor</li>
    <li>Open footer.php</li>
    <li>Paste before &lt;/body&gt;</li>
    <li>Click Update File</li>
  </ol>

  <p style="color:red; font-size:12px;">
    ⚠️ Warning: Editing theme files incorrectly may break your website. Always backup.
  </p>

  <p><strong>Method 3 (Customizer / Plugin)</strong></p>
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
  <hr />

  <h3>React / Next.js</h3>

  <p> Use the Next.js Script component to properly load the Digital Assistant:</p>

 <div style="background:#000; color:#00ff00; padding:10px; border-radius:6px; font-size:13px; white-space:pre-wrap; font-family:monospace;">
import Script from "next/script";

export default function Layout() {
  return (
    &lt;&gt;

      &lt;Script id="chatorder-init" strategy="afterInteractive"&gt;
        window.chatorder = window.chatorder || function() {
          (window.chatorder.q = window.chatorder.q || []).push(arguments);
        };

        window.chatorder('init', {
          botId: 'client-d',
          theme: 'dark'
        });
      &lt;/Script&gt;

      &lt;Script
        src="https://chatorder.vercel.app/chatbot.js"
        strategy="afterInteractive"
      /&gt;

    &lt;/&gt;
  );
}
</div>

  <ol>
    <li>Open layout.tsx or _app.tsx</li>
    <li>Add Script component</li>
    <li>Save and refresh</li>
  </ol>

  <hr />

  <h3 style="color:green;">✅ Integration Complete</h3>
  <p style="color:green;">
    The Digital Assistant should now appear automatically on your website.
  </p>

</div>
`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Digital Assistant Integration Guide",
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "API working" });
}