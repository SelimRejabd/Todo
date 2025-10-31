import dotenv from "dotenv";
dotenv.config();

const getEnv = (key: string, required = true, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  // console.log(`Environment variable ${key}: ${value}`);

  if (required && !value) {
    throw new Error(`Environment variable ${key} is required but not set.`);
  }
  return value!;
};

export const config = {
  port: parseInt(getEnv("PORT", false, "5000")),
  database_url: getEnv("MONGO_URI"),
  node_env: getEnv("NODE_ENV", false, "development"),
  local_frontend_url: getEnv(
    "LOCAL_FRONTEND_URL",
    false,
    "http://localhost:3000"
  ),
  prod_frontend_url: getEnv(
    "PROD_FRONTEND_URL",
    false,
    "https://your-production-domain.com"
  ),
};
