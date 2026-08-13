import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),

  COGNODB_URI: z.string().min(1, "COGNODB_URI is required"),

  COGNODB_USERNAME: z.string().min(1, "COGNODB_USERNAME is required"),

  COGNODB_PASSWORD: z.string().min(1, "COGNODB_PASSWORD is required"),

  FRONTEND_URL: z.string().default("http://localhost:5173"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Invalid environment variables");
  console.error(result.error.format());

  process.exit(1);
}

export const env = result.data;