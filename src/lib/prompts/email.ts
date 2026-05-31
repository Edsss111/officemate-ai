import type { EmailWriterInput } from "@/lib/validations/email";

export const EMAIL_SYSTEM_PROMPT = `You are an expert business communication assistant for office professionals.
Write clear, professional emails suitable for workplace use.
Rules:
- Use proper greeting and closing appropriate to the tone
- Keep paragraphs short and scannable
- Do not invent facts, dates, or commitments not implied by the user
- Use neutral placeholders like [date] when details are missing
- Never include harmful or unprofessional content
- Output must match the JSON schema exactly`;

export function buildEmailUserPrompt(input: EmailWriterInput): string {
  const points = input.keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n");
  return `Write a professional email:

Recipient: ${input.recipient}
Purpose: ${input.purpose}
Tone: ${input.tone}

Key points:
${points}

Provide:
- subject and body (primary)
- alternatives: exactly 2 more versions with different subject/body
- Body as plain text with line breaks, not HTML`;
}

export const emailOutputJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subject: { type: "string" },
    body: { type: "string" },
    alternatives: {
      type: "array",
      minItems: 2,
      maxItems: 2,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          subject: { type: "string" },
          body: { type: "string" },
        },
        required: ["subject", "body"],
      },
    },
  },
  required: ["subject", "body", "alternatives"],
} as const;
