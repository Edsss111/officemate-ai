import type { SupabaseClient } from "@supabase/supabase-js";

const FREE_DAILY_LIMIT = 10;

export async function checkAndIncrementUsage(
  supabase: SupabaseClient,
  userId: string,
  plan: string
): Promise<{ allowed: boolean; used: number; limit: number | null }> {
  if (plan === "pro") {
    return { allowed: true, used: 0, limit: null };
  }

  const today = new Date().toISOString().slice(0, 10);

  const { data: row } = await supabase
    .from("usage_daily")
    .select("count")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  const used = row?.count ?? 0;

  if (used >= FREE_DAILY_LIMIT) {
    return { allowed: false, used, limit: FREE_DAILY_LIMIT };
  }

  if (row) {
    await supabase
      .from("usage_daily")
      .update({ count: used + 1 })
      .eq("user_id", userId)
      .eq("date", today);
  } else {
    await supabase.from("usage_daily").insert({
      user_id: userId,
      date: today,
      count: 1,
    });
  }

  return { allowed: true, used: used + 1, limit: FREE_DAILY_LIMIT };
}
