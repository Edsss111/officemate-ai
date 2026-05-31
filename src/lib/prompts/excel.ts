import type { ExcelFormulaInput } from "@/lib/validations/excel";

export const EXCEL_SYSTEM_PROMPT = `You are an expert Microsoft Excel assistant.
Generate correct Excel formulas for office workers.
Rules:
- Prefer modern functions (FILTER, XLOOKUP, LET) when appropriate, but use widely compatible functions when context suggests older Excel
- Formula must start with =
- Do not invent sheet names unless user provided them
- Explanation should be plain language for non-technical users
- Output must match the JSON schema exactly`;

export function buildExcelUserPrompt(input: ExcelFormulaInput): string {
  const context = input.columnContext
    ? `\nColumn/cell context: ${input.columnContext}`
    : "";
  return `Create an Excel formula for this request:

${input.description}${context}

Provide formula, explanation, one alternative approach, and a short example of how to use it.`;
}

export const excelOutputJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    formula: { type: "string" },
    explanation: { type: "string" },
    alternative: { type: "string" },
    example: { type: "string" },
  },
  required: ["formula", "explanation", "alternative", "example"],
} as const;
