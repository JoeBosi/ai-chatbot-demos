import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Native ONNX runtime used for local embeddings: load from node_modules at runtime.
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node"],
  outputFileTracingIncludes: {
    "/*": ["./drizzle/**/*"],
  },
  poweredByHeader: false,
  // The dev server is opened as http://127.0.0.1:3041; without this Next blocks HMR and the page reloads in a loop.
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    const base = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    const csp = "img-src 'self' data: blob:; object-src 'none'; base-uri 'self'";
    return [
      {
        // Everything except /embed: only this site may frame it. Two rules instead of one because
        // duplicate CSP headers are intersected by the browser, which would block the widget.
        source: "/((?!embed).*)",
        headers: [...base, { key: "Content-Security-Policy", value: `frame-ancestors 'self'; ${csp}` }],
      },
      {
        // The widget is meant to be framed by any site, so no frame-ancestors restriction here.
        // Both patterns, or /embed/anything would ship no headers at all.
        source: "/embed",
        headers: [...base, { key: "Content-Security-Policy", value: csp }],
      },
      {
        source: "/embed/:path*",
        headers: [...base, { key: "Content-Security-Policy", value: csp }],
      },
      {
        source: "/widget.js",
        headers: [{ key: "Cache-Control", value: "public, max-age=300, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
