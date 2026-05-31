import { handleAiRequest } from "@/lib/api/ai-route";
import {
  EMAIL_SYSTEM_PROMPT,
  buildEmailUserPrompt,
  emailOutputJsonSchema,
} from "@/lib/prompts/email";
import { emailWriterSchema } from "@/lib/validations/email";
import type { EmailWriterInput } from "@/lib/validations/email";
import type { EmailWriterOutput } from "@/types/ai";

export async function POST(request: Request) {
  const body = await request.json();
  return handleAiRequest<EmailWriterInput, EmailWriterOutput>({
    tool: "email",
    schema: emailWriterSchema,
    body,
    system: EMAIL_SYSTEM_PROMPT,
    buildUserPrompt: buildEmailUserPrompt,
    schemaName: "email_writer_output",
    jsonSchema: emailOutputJsonSchema as Record<string, unknown>,
  });
}
