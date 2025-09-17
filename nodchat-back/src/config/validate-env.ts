import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string({ message: "DATABASE_URL is required" }),
  JWT_SECRET: z.string({ message: "JWT_SECRET is required" }),
  JWT_EXPIRES_IN: z.string({ message: "JWT_EXPIRES_IN is required" }),
  JWT_COOKIE_EXPIRES_IN: z.coerce.number({
    message: "JWT_COOKIE_EXPIRES_IN is required",
  }),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  throw new Error(
    `Environment variables validation error, ${result.error.errors
      .map((err) => err.message)
      .join(", ")}`,
  );
}

export const env = result.data;
