import { z } from "zod";

export const loginSchema = z.object({
  username: z.string({ message: "Username is required" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),
});
