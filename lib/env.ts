import "server-only";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${name}. Add it to .env.local.`,
    );
  }
  return value.trim();
}

const mongodbUri = requireEnv("MONGODB_URI");

if (!/^mongodb(\+srv)?:\/\//.test(mongodbUri)) {
  throw new Error("MONGODB_URI must start with mongodb:// or mongodb+srv://.");
}

const sessionPassword = requireEnv("SESSION_PASSWORD");

if (sessionPassword.length < 32) {
  throw new Error("SESSION_PASSWORD must be at least 32 characters.");
}

export const env = {
  MONGODB_URI: mongodbUri,
  SESSION_PASSWORD: sessionPassword,
} as const;
