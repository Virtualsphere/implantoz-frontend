export const config = {
  api: {
    bodyParser: false, // ✅ Prevent Next.js from consuming the body
  },
};

export default async function handler(req, res) {
  try {
    const BACKEND_API = "http://103.118.16.129:5009" || "http://localhost:5000";

    // ✅ Fix: also handle /files path, not just /api or /auth
    const path = req.url.replace(/^\/(api|auth|files)/, "");

    // ✅ Adjusted URL building logic to handle /files correctly
    let backendUrl;
    if (req.url.startsWith("/auth")) {
      backendUrl = `${BACKEND_API}/auth${path}`;
    } else if (req.url.startsWith("/files")) {
      backendUrl = `${BACKEND_API}/files${path}`;
    } else {
      backendUrl = `${BACKEND_API}/api${path}`;
    }

    // ✅ Keep the rest of your logic exactly the same
    const fetchOptions = {
      method: req.method,
      headers: {
        ...req.headers,
        host: "", // remove host header for backend compatibility
      },
      body:
        req.method === "GET" || req.method === "HEAD"
          ? undefined
          : req, // forward request stream directly
      duplex: "half", // ✅ Required for Vercel / Node 18+ with streams
    };

    const response = await fetch(backendUrl, fetchOptions);

    // Copy backend headers
    response.headers.forEach((value, key) => res.setHeader(key, value));

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      const contentDisposition =
        response.headers.get("content-disposition") ||
        "inline; filename=file";

      res.setHeader("Content-Type", contentType || "application/octet-stream");
      res.setHeader("Content-Disposition", contentDisposition);

      const buffer = await response.arrayBuffer();
      res.status(response.status).send(Buffer.from(buffer));
    }
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({
      success: false,
      message: "Proxy Server Error",
      details: error.message,
    });
  }
}
