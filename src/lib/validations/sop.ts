import { z } from "zod";

export const sopGeneratorSchema = z.object({
  department: z.string().min(1).max(200),
  processName: z.string().min(1).max(200),
  description: z.string().min(10).max(4000),
});

export type SopGeneratorInput = z.infer<typeof sopGeneratorSchema>;
