import { z } from "zod";

export const excelFormulaSchema = z.object({
  description: z.string().min(5).max(2000),
  columnContext: z.string().max(500).optional(),
});

export type ExcelFormulaInput = z.infer<typeof excelFormulaSchema>;
