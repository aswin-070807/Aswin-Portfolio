import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name (at least 2 characters)"),
  email: z.string().trim().email("Please enter a valid email address"),
  message: z
    .string()
    .trim()
    .min(10, "Please enter a message (at least 10 characters)")
    .max(1000, "Message is too long"),
});

export type ContactInput = z.infer<typeof contactSchema>;
