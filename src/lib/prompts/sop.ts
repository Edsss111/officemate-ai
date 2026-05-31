import type { SopGeneratorInput } from "@/lib/validations/sop";

export const SOP_SYSTEM_PROMPT = `You are an expert operations and compliance writer.
Create clear Standard Operating Procedures (SOPs) for office and business environments.
Rules:
- Use professional, directive language
- Procedure steps must be numbered logically in the procedure array (each item is one step as plain text)
- Do not invent regulatory requirements unless implied
- approvalBlock should include signature lines and date placeholders
- Output must match the JSON schema exactly`;

export function buildSopUserPrompt(input: SopGeneratorInput): string {
  return `Create an SOP with these inputs:

Department: ${input.department}
Process name: ${input.processName}
Process description: ${input.description}

Include objective, scope, responsibilities (bullet list as array items), procedure (numbered steps as array items), and approvalBlock (formatted text for signatures).`;
}

export const sopOutputJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objective: { type: "string" },
    scope: { type: "string" },
    responsibilities: {
      type: "array",
      items: { type: "string" },
    },
    procedure: {
      type: "array",
      items: { type: "string" },
    },
    approvalBlock: { type: "string" },
  },
  required: [
    "objective",
    "scope",
    "responsibilities",
    "procedure",
    "approvalBlock",
  ],
} as const;
