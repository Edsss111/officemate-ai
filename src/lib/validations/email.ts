import { z } from "zod";

export const emailToneSchema = z.enum([
  "professional",
  "friendly",
  "firm",
  "apologetic",
  "persuasive",
]);

export const emailWriterSchema = z.object({
  recipient: z.string().min(1).max(200),
  purpose: z.string().min(10).max(2000),
  tone: emailToneSchema,
  keyPoints: z.array(z.string().min(1).max(500)).min(1).max(10),
});

export type EmailWriterInput = z.infer<typeof emailWriterSchema>;
