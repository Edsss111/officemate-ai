import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/lib/usage";
import { generateStructuredJson } from "@/lib/openai";
import type { z } from "zod";

export async function handleAiRequest<TInput, TOutput>(params: {
  tool: string;
  schema: z.ZodType<TInput>;
  body: unknown;
  system: string;
  buildUserPrompt: (data: TInput) => string;
  schemaName: string;
  jsonSchema: Record<string, unknown>;
}): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = params.schema.safeParse(params.body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", user.id)
      .maybeSingle();

    const plan = subscription?.plan ?? "free";
    const usage = await checkAndIncrementUsage(supabase, user.id, plan);

    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: "Daily limit reached",
          used: usage.used,
          limit: usage.limit,
          upgradeUrl: "/billing",
        },
        { status: 429 }
      );
    }

    const result = await generateStructuredJson<TOutput>({
      system: params.system,
      user: params.buildUserPrompt(parsed.data),
      schemaName: params.schemaName,
      schema: params.jsonSchema,
    });

    await supabase.from("ai_requests").insert({
      user_id: user.id,
      tool: params.tool,
    });

    return NextResponse.json({
      data: result,
      usage: { used: usage.used, limit: usage.limit },
    });
  } catch (error) {
    console.error(`[ai/${params.tool}]`, error);
    return NextResponse.json(
      { error: "Failed to generate. Please try again." },
      { status: 500 }
    );
  }
}
