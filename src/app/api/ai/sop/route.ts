import { handleAiRequest } from "@/lib/api/ai-route";
import {
  SOP_SYSTEM_PROMPT,
  buildSopUserPrompt,
  sopOutputJsonSchema,
} from "@/lib/prompts/sop";
import { sopGeneratorSchema } from "@/lib/validations/sop";
import type { SopGeneratorInput } from "@/lib/validations/sop";
import type { SopGeneratorOutput } from "@/types/ai";

export async function POST(request: Request) {
  const body = await request.json();
  return handleAiRequest<SopGeneratorInput, SopGeneratorOutput>({
    tool: "sop",
    schema: sopGeneratorSchema,
    body,
    system: SOP_SYSTEM_PROMPT,
    buildUserPrompt: buildSopUserPrompt,
    schemaName: "sop_generator_output",
    jsonSchema: sopOutputJsonSchema as Record<string, unknown>,
  });
}
