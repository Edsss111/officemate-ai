import { handleAiRequest } from "@/lib/api/ai-route";
import {
  EXCEL_SYSTEM_PROMPT,
  buildExcelUserPrompt,
  excelOutputJsonSchema,
} from "@/lib/prompts/excel";
import { excelFormulaSchema } from "@/lib/validations/excel";
import type { ExcelFormulaInput } from "@/lib/validations/excel";
import type { ExcelFormulaOutput } from "@/types/ai";

export async function POST(request: Request) {
  const body = await request.json();
  return handleAiRequest<ExcelFormulaInput, ExcelFormulaOutput>({
    tool: "excel",
    schema: excelFormulaSchema,
    body,
    system: EXCEL_SYSTEM_PROMPT,
    buildUserPrompt: buildExcelUserPrompt,
    schemaName: "excel_formula_output",
    jsonSchema: excelOutputJsonSchema as Record<string, unknown>,
  });
}
