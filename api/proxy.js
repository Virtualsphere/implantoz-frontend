// api/proxy.js

// 🧩 Disable body parsing so file streams are preserved
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    const BACKEND_API = "http://103.118.16.129:5009" || "http://localhost:5000";

    // Preserve your original /api and /auth routing logic
    const path = req.url.replace(/^\/(api|auth)/, "");
    const backendUrl = `${BACKEND_API}${
      req.url.startsWith("/auth") ? "/auth" + path : "/api" + path
    }`;

    // Forward raw request to backend (this fixes Busboy)
    const fetchOptions = {
      method: req.method,
      headers: {
        ...req.headers,
        host: "", // remove host header for backend compatibility
      },
      body:
        req.method === "GET" || req.method === "HEAD"
          ? undefined
          : req, // forward raw body directly
    };

    const response = await fetch(backendUrl, fetchOptions);

    // Copy backend headers to frontend response
    response.headers.forEach((value, key) => res.setHeader(key, value));

    // Detect content type
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      // JSON responses
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      // File or other binary responses
      const contentDisposition =
        response.headers.get("content-disposition") ||
        "inline; filename=file.pdf";

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
