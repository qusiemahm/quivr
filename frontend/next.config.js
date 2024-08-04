const path = require("path");

const nextConfig = {
  output: "standalone",
  webpack: (config) => {
    // Resolve the @ alias for Sass
    config.resolve.alias["@"] = path.join(__dirname, ".");

    // Important: return the modified config
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  redirects: async () => {
    return [
      {
        source: "/studio/library",
        destination: "/library",
        permanent: false,
      },
    ];
  },
  images: {
    domains: [
      "www.quivr.app",
      "chat.quivr.app",
      "quivr-cms.s3.eu-west-3.amazonaws.com",
      "www.gravatar.com",
      "media.licdn.com",
      "*",
    ],
  },
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

const ContentSecurityPolicy = {
  "default-src": [
    "'self'",
    "https://fonts.googleapis.com",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    "https://api.june.so",
    "https://us.posthog.com",
    "https://preview.quivr.app",
    "https://chat.quivr.app",
    "*.intercom.io",
    "*.intercomcdn.com",
    "https://*.vercel.app",
    process.env.NEXT_PUBLIC_FRONTEND_URL,
  ],
  "connect-src": [
    "'self'",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL.replace("https", "wss"),
    process.env.NEXT_PUBLIC_SUPABASE_URL.replace("http", "ws"),
    process.env.NEXT_PUBLIC_BACKEND_URL,
    process.env.NEXT_PUBLIC_CMS_URL,
    "*.intercom.io",
    "*.intercomcdn.com",
    "https://api.june.so",
    "https://api.openai.com",
    "https://cdn.growthbook.io",
    "https://vitals.vercel-insights.com/v1/vitals",
    "https://us.posthog.com",
  ],
  "img-src": [
    "'self'",
    "https://www.gravatar.com",
    "*.intercom.io",
    "*.intercomcdn.com",
    "https://quivr-cms.s3.eu-west-3.amazonaws.com",
    "data:",
    "*",
  ],
  "media-src": [
    "'self'",
    "https://user-images.githubusercontent.com",
    process.env.NEXT_PUBLIC_FRONTEND_URL,
    "https://quivr-cms.s3.eu-west-3.amazonaws.com",
    "https://preview.quivr.app",
    "https://chat.quivr.app",
    "https://*.vercel.app",
  ],
  "script-src": [
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://va.vercel-scripts.com/",
    "*.intercom.io",
    "*.intercomcdn.com",
    process.env.NEXT_PUBLIC_FRONTEND_URL,
    "https://preview.quivr.app",
    "https://*.vercel.app",
    "https://www.google-analytics.com/",
    "https://js.stripe.com",
    "https://us.posthog.com",
    "https://y040k44.65.21.12.12.sslip.io",
  ],
  "frame-src": ["https://js.stripe.com", "https://us.posthog.com"],
  "frame-ancestors": ["'none'"],
  "style-src": [
    "'unsafe-inline'",
    process.env.NEXT_PUBLIC_FRONTEND_URL,
    "https://preview.quivr.app",
    "https://*.vercel.app",
    "https://y040k44.65.21.12.12.sslip.io",
  ],
};

// Build CSP string
const cspString = Object.entries(ContentSecurityPolicy)
  .map(([key, values]) => `${key} ${values.join(" ")};`)
  .join(" ");

// Define headers
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspString,
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000",
  },
];

// Add Sentry configuration if SENTRY_DSN is defined
if (process.env.SENTRY_DSN) {
  const { withSentryConfig } = require("@sentry/nextjs");

  module.exports = withSentryConfig(
    nextConfig,
    {
      silent: true,
      org: "quivr-brain",
      project: "javascript-nextjs",
    },
    {
      widenClientFileUpload: true,
      transpileClientSDK: true,
      tunnelRoute: "/monitoring",
      hideSourceMaps: true,
      disableLogger: true,
      automaticVercelMonitors: true,
    }
  );
} else {
  module.exports = nextConfig;
}
