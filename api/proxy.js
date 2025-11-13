// api/proxy.js

export const config = {
  api: {
    bodyParser: false, // ✅ Prevent Next.js from consuming the body
  },
};

export default async function handler(req, res) {
  try {
    const BACKEND_API = "http://103.118.16.129:5009" || "http://localhost:5000";

    // ✅ Remove /api or /auth prefix from the incoming path
    const path = req.url.replace(/^\/(api|auth)/, "");

    // ✅ Build the full backend URL (works for both /api and /files, etc.)
    const backendUrl = `${BACKEND_API}${path}`;

    console.log("Proxying request to:", backendUrl);

    // ✅ Prepare fetch options
    const options = {
      method: req.method,
      headers: {
        ...req.headers,
      },
    };

    // ✅ Send body for non-GET/HEAD requests
    if (req.method !== "GET" && req.method !== "HEAD") {
      options.body = JSON.stringify(req.body);
      options.headers["Content-Type"] = "application/json";
    }

    // ✅ Fetch from backend
    const response = await fetch(backendUrl, options);

    // ✅ Forward status and headers
    res.status(response.status);
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    res.setHeader("Content-Type", contentType);

    // ✅ Handle binary/image responses
    if (contentType.startsWith("image/") || contentType.includes("application/pdf")) {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.send(buffer);
      return;
    }

    // ✅ Handle JSON responses
    if (contentType.includes("application/json")) {
      const data = await response.json();
      res.json(data);
      return;
    }

    // ✅ Handle text/HTML/etc.
    const text = await response.text();
    res.send(text);

  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ success: false, message: "Proxy Server Error", details: error.message });
  }
}
