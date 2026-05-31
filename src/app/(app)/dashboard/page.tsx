import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/config/navigation";
import { Mail, FileText, Table2, Zap } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = new Date().toISOString().slice(0, 10);

  const [{ data: subscription }, { data: usage }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", user!.id)
      .maybeSingle(),
    supabase
      .from("usage_daily")
      .select("count")
      .eq("user_id", user!.id)
      .eq("date", today)
      .maybeSingle(),
  ]);

  const plan = subscription?.plan ?? "free";
  const used = usage?.count ?? 0;
  const dailyLimit = plan === "free" ? 10 : null;

  const tools = [
    { ...mainNav[1], icon: Mail },
    { ...mainNav[2], icon: FileText },
    { ...mainNav[3], icon: Table2 },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back. Pick a tool to get started."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Today&apos;s AI usage</CardDescription>
            <CardTitle className="text-3xl">
              {dailyLimit !== null ? `${used} / ${dailyLimit}` : used}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {plan === "free"
                ? "Resets daily. Upgrade for unlimited."
                : "Pro — unlimited requests."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Plan</CardDescription>
            <CardTitle className="text-3xl capitalize">{plan}</CardTitle>
          </CardHeader>
          <CardContent>
            {plan === "free" ? (
              <Button asChild size="sm">
                <Link href="/billing">Upgrade to Pro</Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link href="/billing">Manage billing</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Account</CardDescription>
            <CardTitle className="truncate text-lg">{user?.email}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {plan === "free"
                ? "10 AI requests per day on Free."
                : "Unlimited AI requests on Pro."}
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription>Quick tip</CardDescription>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-primary" />
              Be specific
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              More context in your prompt means better emails, SOPs, and
              formulas.
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        AI Tools
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.href} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <tool.icon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className="w-full">
                <Link href={tool.href}>Open tool</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
