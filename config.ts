import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Configuration object to manage environment variables and settings
const config = {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    apiUrl: process.env.GITHUB_API_URL || "https://api.github.com",
  },
  rateLimit: {
    maxRequestsPerHour: parseInt(process.env.MAX_REQUESTS_PER_HOUR || "5000", 10),
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || "",
  },
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
  },
};

// Validate required environment variables
if (!config.github.clientId || !config.github.clientSecret) {
  throw new Error(
    "Missing required GitHub API credentials. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in your environment."
  );
}

export default config;
