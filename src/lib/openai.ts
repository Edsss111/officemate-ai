import OpenAI from "openai";

export const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}

export async function generateStructuredJson<T>(params: {
  system: string;
  user: string;
  schemaName: string;
  schema: Record<string, unknown>;
}): Promise<T> {
  const response = await getOpenAI().chat.completions.create({
    model: DEFAULT_MODEL,
    temperature: 0.7,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: params.schemaName,
        strict: true,
        schema: params.schema,
      },
    },
    messages: [
      { role: "system", content: params.system },
      { role: "user", content: params.user },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from OpenAI");
  }

  return JSON.parse(content) as T;
}
