import { Gender } from "@prisma/client";
import { z } from "zod";

export const signupSchema = z
  .object({
    username: z.string({ message: "Username is required" }),
    fullName: z.string({ message: "Full name is required" }),
    password: z
      .string({ message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string({ message: "Confirm password is required" })
      .min(8, {
        message: "Confirm password must be at least 8 characters long",
      }),
    gender: z.enum([Gender.female, Gender.male]),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"], // Make sure the issue is tied to the correct field
      });
      return false;
    }
    return true;
  });
